import storage from 'shared/storage'
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
  getSignedVAAWithRetry,
  sendTransaction,
} from '../helper'
import { WormholeProvider } from '../wormhole'

type TransferData = {
  step: number
  amount: string
  sourceNetWork: {
    sequence: string
    emitterAddress: string
  }
  wormholeNetWork: {
    vaaHex: string
  }
}

export class WormholeTransfer {
  wormhole: WormholeProvider
  data: TransferData | undefined
  key = 'wormhole:transfer'
  constructor(wormhole: WormholeProvider) {
    this.wormhole = wormhole
  }

  fetchAll = async (): Promise<Record<string, TransferData>> => {
    const data = storage.get(this.key)
    return data || {}
  }

  restore = async () => {
    const contextId = this.wormhole.context.id
    const store = await this.fetchAll()
    const data = store[contextId]
    if (!data) throw new Error('Invalid context id')
    this.data = data
  }

  backup = async () => {
    if (!this.data) throw new Error('Invalid data')
    const store = await this.fetchAll()
    const id = this.wormhole.context.id
    store[id] = this.data
    storage.set(this.key, store)
  }

  transfer = async (amount: string) => {
    // init data transfer
    this.data = {
      step: 0,
      amount,
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

    await approveEth(
      context.srcTokenBridgeAddress,
      context.tokenInfo.address,
      signer,
      amountTransfer,
    )
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
