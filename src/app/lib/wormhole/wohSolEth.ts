import {
  CHAIN_ID_ETH,
  hexToUint8Array,
  transferFromSolana,
  WSOL_ADDRESS,
  getOriginalAssetSol,
  attestFromSolana,
  parseSequenceFromLogSolana,
  transferNativeSol,
  nativeToHexString,
  redeemOnEth,
  createWrappedOnEth,
  uint8ArrayToHex,
  getEmitterAddressSolana,
  ChainId,
} from '@certusone/wormhole-sdk'
import { utils, WalletInterface } from '@senswap/sen-js'

import { sendTransaction } from './helper/utils'
import { WormholeProvider } from './provider'
import { IEtherWallet } from '../etherWallet/walletInterface'
import {
  StepTransfer,
  WohTokenInfo,
  TransferData,
} from 'app/constant/types/wormhole'
import { createSolEtherContext } from './context'

class WohSolEth extends WormholeProvider {
  private srcWallet: WalletInterface
  private targetWallet: IEtherWallet
  constructor(
    sourceWallet: WalletInterface,
    targetWallet: IEtherWallet,
    tokenInfo: WohTokenInfo,
  ) {
    super()
    this.srcWallet = sourceWallet
    this.targetWallet = targetWallet
    const cloneTokenInfo: WohTokenInfo = JSON.parse(JSON.stringify(tokenInfo))
    this.context = createSolEtherContext(cloneTokenInfo)
  }

  private isNative = () => {
    return this.context?.tokenInfo.address === WSOL_ADDRESS
  }

  protected isAttested = async (): Promise<{
    chainId: ChainId
    attested: boolean
    wrappedMintAddress: string | null
  }> => {
    const { context } = this.getState()
    const originAsset = await getOriginalAssetSol(
      this.getConnection(),
      context.srcTokenBridgeAddress,
      context.tokenInfo.address,
    )
    const wrappedMintAddress = uint8ArrayToHex(originAsset.assetAddress)

    return {
      attested: !!wrappedMintAddress,
      wrappedMintAddress,
      // The ancestor chain of token
      chainId: originAsset.chainId,
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
    // Create inputs
    const { transferData, context } = this.getState()
    const { splt } = window.sentre
    const connection = this.getConnection()
    const payerAddress = await this.srcWallet.getAddress()
    const targetAddress = await this.targetWallet.getAddress()
    const amountTransfer = utils.decimalize(
      transferData.amount,
      context.tokenInfo.decimals,
    )
    let { wrappedMintAddress, chainId } = await this.isAttested()
    if (!wrappedMintAddress) throw new Error('Attest the token first')
    const dstAddress = await splt.deriveAssociatedAddress(
      payerAddress,
      context.tokenInfo.address,
    )
    const hexString = nativeToHexString(targetAddress, CHAIN_ID_ETH)
    if (!hexString) {
      throw new Error('Invalid recipient')
    }
    const vaaCompatibleAddress = hexToUint8Array(hexString)
    // transfer
    const transferReceipt = this.isNative()
      ? await transferNativeSol(
          connection,
          context.srcBridgeAddress,
          context.srcTokenBridgeAddress,
          payerAddress,
          amountTransfer,
          vaaCompatibleAddress,
          CHAIN_ID_ETH,
        )
      : await transferFromSolana(
          connection,
          context.srcBridgeAddress,
          context.srcTokenBridgeAddress,
          payerAddress,
          dstAddress,
          context.tokenInfo.address,
          amountTransfer,
          vaaCompatibleAddress,
          CHAIN_ID_ETH,
          hexToUint8Array(wrappedMintAddress),
          chainId,
        )
    console.log(transferData, context, 'ngueyenen')
    const signedTx = await this.srcWallet.signTransaction(transferReceipt)
    const txId = await sendTransaction(signedTx, connection)
    console.log('xuong toi day')
    const info = await connection.getTransaction(txId)
    if (!info) {
      throw new Error('An error occurred while fetching the transaction info')
    }
    const sequence = parseSequenceFromLogSolana(info)
    const emitterAddress = await getEmitterAddressSolana(
      context.srcTokenBridgeAddress,
    )

    return {
      sequence,
      emitterAddress,
      txHash: txId,
    }
  }

  protected submitAttest = async () => {
    const { context } = this.getState()
    const signer = await this.srcWallet.getAddress()
    const connection = await this.getConnection()
    // Send attest
    const receipt = await attestFromSolana(
      this.getConnection(),
      context.srcBridgeAddress,
      context.srcTokenBridgeAddress,
      signer,
      context.tokenInfo.address,
    )
    const signedTx = await this.srcWallet.signTransaction(receipt)
    const txId = await sendTransaction(signedTx, connection)
    const info = await connection.getTransaction(txId)
    if (!info) {
      throw new Error('An error occurred while fetching the transaction info')
    }
    const sequence = parseSequenceFromLogSolana(info)
    const emitterAddress = await getEmitterAddressSolana(
      context.srcTokenBridgeAddress,
    )

    return { sequence, emitterAddress }
  }

  protected wrapToken = async (vaaHex: string) => {
    const { context } = this.getState()
    const vaaBytes = hexToUint8Array(vaaHex)
    const targetProvider = await this.targetWallet.getProvider()
    // Wrap token
    const tx = await createWrappedOnEth(
      context.targetTokenBridgeAddress,
      targetProvider.getSigner(),
      vaaBytes,
    )

    return tx.transactionHash
  }

  protected redeem = async (vaaHex: string) => {
    const { context } = this.getState()
    const vaaBytes = hexToUint8Array(vaaHex)
    const targetProvider = await this.targetWallet.getProvider()

    const tx = await redeemOnEth(
      context.targetTokenBridgeAddress,
      targetProvider.getSigner(),
      vaaBytes,
    )

    return tx.transactionHash
  }
}

export default WohSolEth
