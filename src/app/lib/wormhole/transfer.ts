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
    return { ...data }
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

    let txId = ''
    switch (this.data.step) {
      case 0:
        await this.transferSourceNetWork()
        await this.backup()
        await onUpdate(this.getState())

        await this.waitSignedWormhole()
        await this.backup()
        await onUpdate(this.getState())

        txId = await this.redeemSolana()
        await this.backup()
        await onUpdate(this.getState())

        return txId
      case 1:
        await this.waitSignedWormhole()
        await this.backup()
        await onUpdate(this.getState())

        txId = await this.redeemSolana()
        await this.backup()
        await onUpdate(this.getState())
        return txId

      case 2:
        txId = await this.redeemSolana()
        await this.backup()
        await onUpdate(this.getState())
        return txId

      default:
        throw new Error('Invalid step transfer')
    }
  }

  // step 0
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
    transferData.sourceNetWork = {
      sequence,
      emitterAddress,
    }
    await this.backup()
    // next step
    return this.waitSignedWormhole()
  }

  // step 1
  private async waitSignedWormhole() {
    const { transferData, context } = this.getState()
    // get data prevStep
    const { emitterAddress, sequence } = transferData.sourceNetWork
    // Get signedVAA
    const { vaaBytes } = await getSignedVAAWithRetry(
      context.wormholeRpc,
      CHAIN_ID_ETH,
      emitterAddress,
      sequence,
    )
    const vaaHex = Buffer.from(vaaBytes).toString('hex')
    // backup
    transferData.wormholeNetWork.vaaHex = vaaHex
    await this.backup()
    // next step
    return this.redeemSolana()
  }

  // step 2
  private async redeemSolana() {
    const { transferData, context } = this.getState()

    // get data prevStep
    const { vaaHex } = transferData.wormholeNetWork
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
    //
    transferData.redeemSolana.txId = txId
    await this.backup()
    return txId
  }
}
