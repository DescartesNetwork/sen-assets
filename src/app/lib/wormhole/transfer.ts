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
  DEFAULT_TRANSFER_DATA,
  TransferData,
  WormholeStoreKey,
} from './constant/wormhole'

export class WormholeTransfer {
  wormhole: WormholeProvider
  data: TransferData | undefined
  constructor(wormhole: WormholeProvider) {
    this.wormhole = wormhole
  }

  static fetchAll = async (): Promise<Record<string, TransferData>> => {
    const data = await getWormholeDb<Record<string, TransferData>>(
      WormholeStoreKey.Transfer,
    )
    return data || {}
  }

  restore = async () => {
    const contextId = this.wormhole.context.id
    const database = await WormholeTransfer.fetchAll()
    const data = database[contextId]
    if (!data) throw new Error('Invalid context id')
    this.data = data
    return this.data
  }

  backup = async () => {
    if (!this.data) throw new Error('Invalid data')
    // next step
    this.data.step++
    // write to database
    const transferData = await WormholeTransfer.fetchAll()
    transferData[this.wormhole.context.id] = this.data
    setWormholeDb(WormholeStoreKey.Transfer, transferData)
    await this.wormhole.backup()
    // update status
    await this.wormhole.callbackUpdate(this.wormhole)
    return this.wormhole
  }

  transfer = async (amount: string) => {
    // init data transfer
    if (!this.data) {
      this.data = { ...DEFAULT_TRANSFER_DATA }
      this.data.from = await this.wormhole.srcWallet.getAddress()
      this.data.to = await this.wormhole.targetWallet.getAddress()
      this.data.amount = amount
    }

    switch (this.data.step) {
      case 0:
        return this.transferSourceNetWork()
      case 1:
        return this.waitSignedWormhole()
      case 2:
        return this.redeemSolana()
    }
    throw new Error('Invalid step transfer')
  }

  // step 0
  private transferSourceNetWork = async () => {
    if (!this.wormhole) throw new Error('Invalid context')
    if (!this.data) throw new Error('Invalid data')
    const { context, srcWallet, targetWallet, isAttested } = this.wormhole
    // get context
    let { wrappedMintAddress } = await isAttested()
    if (!wrappedMintAddress) throw new Error('Attest the token first')
    // get provider
    const provider = await srcWallet.getProvider()
    const signer = provider.getSigner()
    const amountTransfer = utils.decimalize(
      this.data.amount,
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
      targetWallet,
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
    this.data.sourceNetWork = {
      sequence,
      emitterAddress,
    }
    await this.backup()
    // next step
    return this.waitSignedWormhole()
  }

  // step 1
  private async waitSignedWormhole() {
    if (!this.wormhole) throw new Error('Invalid context')
    if (!this.data) throw new Error('Invalid data')
    const { context } = this.wormhole
    // get data prevStep
    const { emitterAddress, sequence } = this.data.sourceNetWork
    // Get signedVAA
    const { vaaBytes } = await getSignedVAAWithRetry(
      context.wormholeRpc,
      CHAIN_ID_ETH,
      emitterAddress,
      sequence,
    )
    const vaaHex = Buffer.from(vaaBytes).toString('hex')
    // backup
    this.data.wormholeNetWork.vaaHex = vaaHex
    await this.backup()
    // next step
    return this.redeemSolana()
  }

  // step 2
  private async redeemSolana() {
    if (!this.wormhole) throw new Error('Invalid context')
    if (!this.data) throw new Error('Invalid data')
    const { context, targetWallet, connection } = this.wormhole
    // get data prevStep
    const { vaaHex } = this.data.wormholeNetWork
    const vaaBytes = hexToUint8Array(vaaHex)

    const payerAddress = await targetWallet.getAddress()
    await postVaaSolana(
      connection,
      targetWallet.signTransaction,
      context.targetBridgeAddress,
      payerAddress,
      Buffer.from(vaaBytes),
    )

    const tx = await redeemOnSolana(
      connection,
      context.targetBridgeAddress,
      context.targetTokenBridgeAddress,
      payerAddress,
      vaaBytes,
    )
    const signedTx = await targetWallet.signTransaction(tx)
    const txId = await sendTransaction(signedTx, connection)
    //
    this.data.redeemSolana.txId = txId
    await this.backup()
    return txId
  }
}
