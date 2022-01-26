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
  transferFromSolana,
  transferFromEthNative,
  WSOL_ADDRESS,
  getOriginalAssetSol,
  getForeignAssetEth,
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
import { account, utils, WalletInterface } from '@senswap/sen-js'
import { Connection, Keypair, PublicKey } from '@solana/web3.js'
import { Token } from '@solana/spl-token'

import {
  getAssociatedAddress,
  getEtherNetwork,
  sendTransaction,
} from './helper/utils'
import { WormholeProvider } from './provider'
import { IEtherWallet } from '../etherWallet/walletInterface'
import {
  StepTransfer,
  WohTokenInfo,
  TransferData,
} from 'app/constant/types/wormhole'
import { createEtherSolContext, createSolEtherContext } from './context'
import { INFURA_API_WSS_URL, WETH_ADDRESS } from './constant/ethConfig'
import { ethers } from 'ethers'
import { fetchForeignAssetEtherFromSol } from './helper/ether'
import { original } from '@reduxjs/toolkit'
import { ChainID } from '@certusone/wormhole-sdk/lib/cjs/proto/publicrpc/v1/publicrpc'

const zeroAdd = '0x0000000000000000000000000000000000000000'

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
    const provider = await this.targetWallet.getProvider()
    const originAsset = await getOriginalAssetSol(
      this.getConnection(),
      context.srcTokenBridgeAddress,
      context.tokenInfo.address,
    )

    const wrappedMintAddress = uint8ArrayToHex(originAsset.assetAddress)

    // console.log(
    //   uint8ArrayToHex(originAsset.assetAddress),
    //   'sksskssdsjdaisjdajk',
    // )
    // const wrappedMintAddress = await getForeignAssetEth(
    //   context.targetTokenBridgeAddress,
    //   provider,
    //   originAsset.chainId,
    //   originAsset.assetAddress,
    // )
    console.log(
      context,
      wrappedMintAddress,
      originAsset,
      uint8ArrayToHex(originAsset.assetAddress),
      'go herreeee',
    )

    return {
      // attested: originAsset.isWrapped,
      chainId: originAsset.chainId,
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
    let { wrappedMintAddress, chainId } = await this.isAttested()
    if (!wrappedMintAddress) throw new Error('Attest the token first')

    // get provider
    const splt = window.sentre.splt
    const provider = await this.srcWallet.getProvider()
    const connection = this.getConnection()
    const payerAddress = await this.srcWallet.getAddress()
    const targetAddress = await this.targetWallet.getAddress()
    // const signer = provider.getSigner()
    const amountTransfer = utils.decimalize(
      transferData.amount,
      context.tokenInfo.decimals,
    )

    console.log(wrappedMintAddress, 'sksksksk')

    const sourceAddress = await this.srcWallet.getAddress()
    const dstAddress = await splt.deriveAssociatedAddress(
      sourceAddress,
      context.tokenInfo.address,
    )
    const hexString = nativeToHexString(targetAddress, CHAIN_ID_ETH)
    if (!hexString) {
      throw new Error('Invalid recipient')
    }
    const srchexString = nativeToHexString(sourceAddress, CHAIN_ID_SOLANA)
    if (!srchexString) {
      throw new Error('Invalid recipient')
    }
    const vaaCompatibleAddress = hexToUint8Array(hexString)
    const srcVaaAddress = hexToUint8Array(srchexString)

    console.log(
      connection,
      context.srcBridgeAddress,
      context.srcTokenBridgeAddress,
      payerAddress,
      dstAddress,
      context.tokenInfo.address,
      amountTransfer,
      wrappedMintAddress,
      CHAIN_ID_ETH,
      chainId,
    )

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
          2,
          hexToUint8Array(wrappedMintAddress),
          chainId,
        )
    const signedTx = await this.srcWallet.signTransaction(transferReceipt)
    const txId = await sendTransaction(signedTx, connection)
    // await this.srcWallet.signTransaction(transferReceipt)
    // const txid = await connection.sendRawTransaction(
    //   transferReceipt.serialize(),
    // )
    // await connection.confirmTransaction(txId)
    const info = await connection.getTransaction(txId)
    console.log('Heeeeesskskskkskse', info)
    if (!info) {
      throw new Error('An error occurred while fetching the transaction info')
    }
    const sequence = parseSequenceFromLogSolana(info)
    console.log('lay duoc sequence', sequence)
    const emitterAddress = await getEmitterAddressSolana(
      context.srcTokenBridgeAddress,
    )
    console.log('lay duoc emiiter add', info)
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

    // receipt.partialSign(keypair) Note here to check in priority way
    // this.srcWallet.rawSignTransaction(receipt)
    // const txid = await this.getConnection().sendRawTransaction(
    //   receipt.serialize(),
    // )
    // await connection.confirmTransaction(txid)
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

    // receipt.sign()
    // const sequence = parseSequenceFromLogSolana(receipt)
  }

  protected wrapToken = async (vaaHex: string) => {
    const { context } = this.getState()
    const vaaBytes = hexToUint8Array(vaaHex)
    const targetProvider = await this.targetWallet.getProvider()

    const tx = await createWrappedOnEth(
      context.targetTokenBridgeAddress,
      targetProvider.getSigner(),
      vaaBytes,
    )
    console.log(tx, 'tx Wrap toke')
    return tx.transactionHash
  }

  protected redeem = async (vaaHex: string) => {
    const { context } = this.getState()
    const vaaBytes = hexToUint8Array(vaaHex)
    const targetProvider = await this.targetWallet.getProvider()

    // await postVaaSolana(
    //   this.getConnection(),
    //   this.targetWallet.signTransaction,
    //   context.targetBridgeAddress,
    //   payerAddress,
    //   Buffer.from(vaaBytes),
    // )
    const tx = await redeemOnEth(
      context.targetTokenBridgeAddress,
      targetProvider.getSigner(),
      vaaBytes,
    )
    return tx.transactionHash
  }
}

export default WohSolEth
