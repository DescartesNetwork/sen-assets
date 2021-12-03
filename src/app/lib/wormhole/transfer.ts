import { account, utils } from '@senswap/sen-js'
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
import {
  getAssociatedAddress,
  getDB,
  getSignedVAAWithRetry,
  sendTransaction,
} from './helper'
import { WormholeProvider } from './provider'

export type TransferData = {
  step: number
  amount: string
  from: string
  to: string
  sourceNetWork: {
    sequence: string
    emitterAddress: string
  }
  wormholeNetWork: {
    vaaHex: string
  }
}

const STORE_KEY = 'transfer'

const transferProcess: Record<string, boolean> = {}

export class WormholeTransfer {
  wormhole: WormholeProvider
  data: TransferData | undefined
  constructor(wormhole: WormholeProvider) {
    this.wormhole = wormhole
  }

  static checkStatus = (id: string) => {
    if (transferProcess[id]) return 'pending'
    return 'error'
  }

  static fetchAll = async (): Promise<Record<string, TransferData>> => {
    const DB = await getDB()
    const db = await DB.getItem<Record<string, TransferData>>(STORE_KEY)
    return db || {}
  }

  restore = async () => {
    const contextId = this.wormhole.context.id
    const store = await WormholeTransfer.fetchAll()
    const data = store[contextId]
    if (!data) throw new Error('Invalid context id')
    this.data = data
  }

  backup = async () => {
    if (!this.data) throw new Error('Invalid data')
    const store = await WormholeTransfer.fetchAll()
    store[this.wormhole.context.id] = this.data
    const DB = await getDB()
    DB.setItem(STORE_KEY, store)
    return this.wormhole.backup()
  }

  transfer = async (amount: string) => {
    transferProcess[this.wormhole.context.id] = true
    // init data transfer
    const srcAddress = await this.wormhole.srcWallet.getAddress()
    const targetAddress = await this.wormhole.targetWallet.getAddress()

    this.data = {
      step: 0,
      amount,
      from: srcAddress,
      to: targetAddress,
      sourceNetWork: {
        emitterAddress: '',
        sequence: '',
      },
      wormholeNetWork: {
        vaaHex: '',
      },
    }
    await this.backup()
    return this.transferSourceNetWork()
  }

  //Fist step
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
    await this.wormhole.callbackUpdate()

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
    return txId
  }
}
