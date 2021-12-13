import {
  approveEth,
  attestFromEth,
  CHAIN_ID_ETH,
  CHAIN_ID_SOLANA,
  createWrappedOnSolana,
  getEmitterAddressEth,
  getForeignAssetSolana,
  getOriginalAssetEth,
  hexToUint8Array,
  parseSequenceFromLogEth,
  postVaaSolana,
  redeemOnSolana,
  transferFromEth,
} from '@certusone/wormhole-sdk'
import { account, utils, WalletInterface } from '@senswap/sen-js'

import { getAssociatedAddress, sendTransaction } from './helper'
import { WormholeProvider } from './provider'
import { IEtherWallet } from '../etherWallet/walletInterface'
import {
  StepTransfer,
  TokenInfo,
  TransferData,
} from 'app/constant/types/wormhole'
import { createEtherSolContext } from './context'

class WohEthSol extends WormholeProvider {
  private srcWallet: IEtherWallet
  private targetWallet: WalletInterface
  constructor(
    sourceWallet: IEtherWallet,
    targetWallet: WalletInterface,
    tokenInfo: TokenInfo,
  ) {
    super()
    this.srcWallet = sourceWallet
    this.targetWallet = targetWallet
    this.context = createEtherSolContext(tokenInfo)
  }

  protected isAttested = async (): Promise<{
    attested: boolean
    wrappedMintAddress: string | null
  }> => {
    const { context } = this.getState()
    const provider = await this.srcWallet.getProvider()
    const originAsset = await getOriginalAssetEth(
      context.srcTokenBridgeAddress,
      provider,
      context.tokenInfo.address,
      CHAIN_ID_ETH,
    )
    const wrappedMintAddress = await getForeignAssetSolana(
      this.getConnection(),
      context.targetTokenBridgeAddress,
      originAsset.chainId,
      originAsset.assetAddress,
    )

    return {
      attested: !!wrappedMintAddress,
      wrappedMintAddress,
    }
  }

  protected initTransferData = async (amount: string) => {
    const srcAddr = await this.srcWallet.getAddress()
    const targetAddr = await this.targetWallet.getAddress()
    const data: TransferData = {
      nextStep: StepTransfer.Transfer,
      amount: amount,
      from: srcAddr,
      to: targetAddr,
      emitterAddress: '',
      sequence: '',
      vaaHex: '',
      txId: '',
      txHash: '',
    }
    return data
  }

  protected submitTransfer = async () => {
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
      txHash: transferReceipt.transactionHash,
    }
  }

  protected submitAttest = async () => {
    const { context } = this.getState()
    const provider = await this.srcWallet.getProvider()
    const signer = provider.getSigner()

    // Send attest
    const receipt = await attestFromEth(
      context.srcTokenBridgeAddress,
      signer,
      context.tokenInfo.address,
    )
    // Fetch attention info
    const sequence = parseSequenceFromLogEth(receipt, context.srcBridgeAddress)
    const emitterAddress = getEmitterAddressEth(context.srcTokenBridgeAddress)
    return { sequence, emitterAddress }
  }

  protected wrapToken = async (vaaHex: string) => {
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

  protected redeem = async (vaaHex: string) => {
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
}

export default WohEthSol
