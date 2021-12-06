import {
  approveEth,
  CHAIN_ID_ETH,
  CHAIN_ID_SOLANA,
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
  TransferData,
  TransferState,
  WormholeStoreKey,
} from './constant/wormhole'
import { DEFAULT_TRANSFER_DATA } from './constant/default'

export class WormholeTransfer extends WormholeProvider {
  data: TransferData | undefined

  getState = (): TransferState => {
    if (!this.data) throw new Error('Invalid data transfer')
    return { transferData: this.data, context: this.context }
  }

  static fetchAll = async (): Promise<Record<string, TransferState>> => {
    const data = await getWormholeDb<Record<string, TransferState>>(
      WormholeStoreKey.Transfer,
    )
    return JSON.parse(JSON.stringify(data))
  }

  restore = async (id: string) => {
    const database = await WormholeTransfer.fetchAll()
    const state = database[id]
    if (!state) throw new Error('Not find state transfer')
    this.data = state.transferData
    this.context = state.context
  }

  backup = async () => {
    const database = await WormholeTransfer.fetchAll()
    const state = this.getState()
    state.transferData.step++
    database[state.context.id] = state
    setWormholeDb(WormholeStoreKey.Transfer, database)
    return state
  }

  /**
   * Transfer: to brigde tokens from origin chain to destination chain
   * The token must be attested beforehand
   * @param amount
   * @returns
   */

  transfer = async (
    amount: string,
    onUpdate: (state: TransferState) => void,
  ) => {
    // init data transfer
    if (!this.data) {
      this.data = { ...DEFAULT_TRANSFER_DATA }
      this.data.from = await this.srcWallet.getAddress()
      this.data.to = await this.targetWallet.getAddress()
      this.data.amount = amount
    }

    let state = this.getState()
    if (this.data.step === 0) {
      const { emitterAddress, sequence } = await this.transferSourceNetWork()
      state.transferData.emitterAddress = emitterAddress
      state.transferData.sequence = sequence
      const newState = await this.backup()
      await onUpdate(newState)
    }

    if (this.data.step === 1) {
      const vaaHex = await this.waitSignedWormhole()
      state.transferData.vaaHex = vaaHex
      const newState = await this.backup()
      await onUpdate(newState)
    }

    if (this.data.step === 2) {
      const txId = await this.redeemSolana()
      state.transferData.txId = txId
      const newState = await this.backup()
      await onUpdate(newState)
      return txId
    }

    throw new Error('Invalid step transfer')
  }

  private transferSourceNetWork = async () => {
    const { transferData, context } = this.getState()
    // get context
    let { wrappedMintAddress } = await this.isAttested()
    if (!wrappedMintAddress) throw new Error('Attest the token first')
    // get provider
    const provider = await this.srcWallet.getProvider()
    const signer = provider.getSigner()
    const amountTransfer = utils.decimalize(
      transferData.amount,
      context.tokenInfo.decimals,
    )

    // callback update
    await approveEth(
      context.srcTokenBridgeAddress,
      context.tokenInfo.address,
      signer,
      amountTransfer,
    )
    // callback update

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
    // backup
    const sequence = parseSequenceFromLogEth(
      transferReceipt,
      context.srcBridgeAddress,
    )
    const emitterAddress = getEmitterAddressEth(context.srcTokenBridgeAddress)
    // next step
    return {
      sequence,
      emitterAddress,
    }
  }

  private async waitSignedWormhole() {
    const { transferData, context } = this.getState()
    // get data prevStep
    const { emitterAddress, sequence } = transferData
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

  private async redeemSolana() {
    const { transferData, context } = this.getState()

    // get data prevStep
    const { vaaHex } = transferData
    const vaaBytes = hexToUint8Array(vaaHex)

    const payerAddress = await this.targetWallet.getAddress()
    await postVaaSolana(
      this.connection,
      this.targetWallet.signTransaction,
      context.targetBridgeAddress,
      payerAddress,
      Buffer.from(vaaBytes),
    )

    const tx = await redeemOnSolana(
      this.connection,
      context.targetBridgeAddress,
      context.targetTokenBridgeAddress,
      payerAddress,
      vaaBytes,
    )
    const signedTx = await this.targetWallet.signTransaction(tx)
    const txId = await sendTransaction(signedTx, this.connection)
    return txId
  }
}
