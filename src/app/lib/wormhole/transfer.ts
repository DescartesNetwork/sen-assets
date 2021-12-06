import {
  approveEth,
  attestFromEth,
  CHAIN_ID_ETH,
  CHAIN_ID_SOLANA,
  createWrappedOnSolana,
  getEmitterAddressEth,
  hexToUint8Array,
  parseSequenceFromLogEth,
  postVaaSolana,
  redeemOnSolana,
  transferFromEth,
} from '@certusone/wormhole-sdk'
import { account, utils } from '@senswap/sen-js'

import {
  getAssociatedAddress,
  getSignedVAAWithRetry,
  getWormholeDb,
  sendTransaction,
  setWormholeDb,
} from './helper'
import { WormholeProvider } from './provider'
import {
  AttestData,
  TransferData,
  TransferState,
  WormholeStoreKey,
} from './constant/wormhole'

export class WormholeTransfer extends WormholeProvider {
  transferData: TransferData | undefined
  attestData: AttestData | undefined

  static fetchAll = async (): Promise<Record<string, TransferState>> => {
    const data = await getWormholeDb<Record<string, TransferState>>(
      WormholeStoreKey.Transfer,
    )
    return JSON.parse(JSON.stringify(data))
  }

  restore = async (id: string) => {
    const database = await WormholeTransfer.fetchAll()
    const stateBackup = database[id]
    if (!stateBackup) throw new Error('Not find state transfer')
    this.transferData = stateBackup.transferData
    this.attestData = stateBackup.attestData
    this.context = stateBackup.context
  }

  backup = async () => {
    const database = await WormholeTransfer.fetchAll()
    const state = this.getState()
    database[state.context.id] = state
    setWormholeDb(WormholeStoreKey.Transfer, database)
    return state
  }

  getState = (): TransferState => {
    if (!this.transferData) throw new Error('Invalid data transfer')
    return {
      transferData: this.transferData,
      context: this.context,
      attestData: this.attestData,
    }
  }

  private initTransferData = async (amount: string) => {
    const from = await this.srcWallet.getAddress()
    const to = await this.targetWallet.getAddress()
    return {
      step: 0,
      amount: amount,
      from,
      to,
      emitterAddress: '',
      sequence: '',
      vaaHex: '',
      txId: '',
    }
  }

  private initAttestData = (): AttestData => {
    if (!this.attestData)
      this.attestData = {
        step: 0,
        sequence: '',
        emitterAddress: '',
        vaaHex: '',
        txId: '',
      }
    return this.attestData
  }

  /**
   * Transfer: to bridge tokens from origin chain to destination chain
   * The token must be attested beforehand
   * @param amount
   * @returns
   */
  transfer = async (
    amount: string,
    onUpdate: (state: TransferState) => void,
  ) => {
    // init data transfer
    if (!this.transferData)
      this.transferData = await this.initTransferData(amount)
    const { transferData } = this.getState()

    const { attested } = await this.isAttested()
    if (!attested) await this.attest(onUpdate)

    if (transferData.step === 0) {
      const { emitterAddress, sequence } = await this.transferSourceNetWork()
      transferData.emitterAddress = emitterAddress
      transferData.sequence = sequence
      transferData.step++
      const newState = await this.backup()
      await onUpdate(newState)
    }
    if (transferData.step === 1) {
      const vaaHex = await this.getSignedVAA(
        transferData.emitterAddress,
        transferData.sequence,
      )
      transferData.vaaHex = vaaHex
      transferData.step++
      const newState = await this.backup()
      await onUpdate(newState)
    }
    if (transferData.step === 2) {
      const newTxId = await this.redeemSolana(transferData.vaaHex)
      transferData.txId = newTxId
      transferData.step++
      const newState = await this.backup()
      await onUpdate(newState)
      return newTxId
    }
    throw new Error('Invalid step transfer')
  }

  private attest = async (onUpdate: (state: TransferState) => void) => {
    const attestData = this.initAttestData()
    if (attestData.step === 0) {
      const { emitterAddress, sequence } = await this.attestSourceNetwork()
      attestData.emitterAddress = emitterAddress
      attestData.sequence = sequence
      attestData.step++
      const newState = await this.backup()
      await onUpdate(newState)
    }
    if (attestData.step === 1) {
      const vaaHex = await this.getSignedVAA(
        attestData.emitterAddress,
        attestData.sequence,
      )
      attestData.vaaHex = vaaHex
      attestData.step++
      const newState = await this.backup()
      await onUpdate(newState)
    }
    if (attestData.step === 2) {
      const txId = await this.wrapSolana(attestData.vaaHex)
      attestData.txId = txId
      attestData.step++
      const newState = await this.backup()
      await onUpdate(newState)
      return txId
    }
    throw new Error('Invalid step attest')
  }

  private transferSourceNetWork = async () => {
    const { transferData, context } = this.getState()
    let { wrappedMintAddress } = await this.isAttested()
    if (!wrappedMintAddress) throw new Error('Attest the token first')

    // get provider
    const provider = await this.srcWallet.getProvider()
    const signer = provider.getSigner()
    const amountTransfer = utils.decimalize(
      transferData.amount,
      context.tokenInfo.decimals,
    )

    await approveEth(
      context.srcTokenBridgeAddress,
      context.tokenInfo.address,
      signer,
      amountTransfer,
    )
    const dstAddress = await getAssociatedAddress(
      wrappedMintAddress,
      this.targetWallet,
    )
    const transferReceipt = await transferFromEth(
      context.srcTokenBridgeAddress,
      signer,
      context.tokenInfo.address,
      amountTransfer,
      CHAIN_ID_SOLANA,
      account.fromAddress(dstAddress).toBuffer(),
    )
    const sequence = parseSequenceFromLogEth(
      transferReceipt,
      context.srcBridgeAddress,
    )
    const emitterAddress = getEmitterAddressEth(context.srcTokenBridgeAddress)
    return {
      sequence,
      emitterAddress,
    }
  }

  private async getSignedVAA(emitterAddress: string, sequence: string) {
    const { context } = this.getState()
    // Get signedVAA
    const { vaaBytes } = await getSignedVAAWithRetry(
      context.wormholeRpc,
      CHAIN_ID_ETH,
      emitterAddress,
      sequence,
    )
    const vaaHex = Buffer.from(vaaBytes).toString('hex')
    return vaaHex
  }

  private async redeemSolana(vaaHex: string) {
    const { context } = this.getState()
    const payerAddress = await this.targetWallet.getAddress()
    const vaaBytes = hexToUint8Array(vaaHex)

    await postVaaSolana(
      this.getConnection(),
      this.targetWallet.signTransaction,
      context.targetBridgeAddress,
      payerAddress,
      Buffer.from(vaaBytes),
    )
    const tx = await redeemOnSolana(
      this.getConnection(),
      context.targetBridgeAddress,
      context.targetTokenBridgeAddress,
      payerAddress,
      vaaBytes,
    )
    const signedTx = await this.targetWallet.signTransaction(tx)
    const txId = await sendTransaction(signedTx, this.getConnection())
    return txId
  }

  private async wrapSolana(vaaHex: string) {
    const { context } = this.getState()
    const payerAddress = await this.targetWallet.getAddress()
    const vaaBytes = hexToUint8Array(vaaHex)

    await postVaaSolana(
      this.getConnection(),
      this.targetWallet.signTransaction,
      context.targetBridgeAddress,
      payerAddress,
      Buffer.from(vaaBytes),
    )
    const tx = await createWrappedOnSolana(
      this.getConnection(),
      context.targetBridgeAddress,
      context.targetTokenBridgeAddress,
      payerAddress,
      vaaBytes,
    )
    const signedTx = await this.targetWallet.signTransaction(tx)
    const txId = await sendTransaction(signedTx, this.getConnection())
    return txId
  }

  attestSourceNetwork = async () => {
    const provider = await this.srcWallet.getProvider()
    const signer = provider.getSigner()
    const context = this.context
    // Send attest
    const receipt = await attestFromEth(
      this.context.srcTokenBridgeAddress,
      signer,
      context.tokenInfo.address,
    )
    // Fetch attention info
    const sequence = parseSequenceFromLogEth(receipt, context.srcBridgeAddress)
    const emitterAddress = getEmitterAddressEth(context.srcTokenBridgeAddress)
    return { sequence, emitterAddress }
  }
}
