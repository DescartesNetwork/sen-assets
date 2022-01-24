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
import { createSolEtherContext } from './context'
import { INFURA_API_WSS_URL, WETH_ADDRESS } from './constant/ethConfig'
import { ethers } from 'ethers'
import session from 'shared/session'
import { key } from 'localforage'
import { fetchForeignAssetEtherFromSol } from './helper/ether'

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
    console.log(cloneTokenInfo, 'clone token info')
    this.context = createSolEtherContext(cloneTokenInfo)
    this.context.tokenInfo.address = tokenInfo.address
  }

  private isNative = () => {
    return this.context?.tokenInfo.address === WSOL_ADDRESS
  }

  protected isAttested = async (): Promise<{
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
    console.log(context.tokenInfo.address)
    const wrappedMintAddress = await fetchForeignAssetEtherFromSol(
      context.tokenInfo.address,
    )

    // const wrappedMintAddress = await getForeignAssetEth(
    //   context.targetTokenBridgeAddress,
    //   provider,
    //   originAsset.chainId,
    //   originAsset.assetAddress,
    // )
    console.log('wrappedMintAddress', wrappedMintAddress)
    console.log(!!wrappedMintAddress, wrappedMintAddress)

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
    //const provider = await this.srcWallet.getProvider()
    const connection = this.getConnection()
    const payerAddress = await this.srcWallet.getAddress()
    const targetAddress = await this.targetWallet.getAddress()
    // const signer = provider.getSigner()
    const amountTransfer = utils.decimalize(
      transferData.amount,
      context.tokenInfo.decimals,
    )

    console.log(amountTransfer, 'amount transfer')

    // await approve(
    //   context.srcTokenBridgeAddress,
    //   context.tokenInfo.address,
    //   signer,
    //   amountTransfer,
    // )
    // const dstAddress = await getAssociatedAddress(
    //   wrappedMintAddress,
    //   this.targetWallet,
    // )
    const sourceAddress = await this.srcWallet.getAddress()
    console.log('targetAddress', targetAddress)
    const hexString = nativeToHexString(targetAddress, CHAIN_ID_ETH)
    console.log('hexString', hexString)
    if (!hexString) {
      throw new Error('Invalid recipient')
    }
    const vaaCompatibleAddress = hexToUint8Array(sourceAddress)

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
          sourceAddress,
          context.tokenInfo.address,
          amountTransfer,
          vaaCompatibleAddress,
          CHAIN_ID_ETH,
          hexToUint8Array(
            account.fromAddress(payerAddress).toBuffer().toString('hex'),
          ),
          CHAIN_ID_SOLANA,
        )

    // connection,
    //   SOL_BRIDGE_ADDRESS,
    //   SOL_TOKEN_BRIDGE_ADDRESS,
    //   payerAddress,
    //   fromAddress,
    //   mintAddress,
    //   amountParsed,
    //   targetAddress,
    //   targetChain,
    //   originAddress,
    //   originChain

    // const secretKey = session.get('SecretKey')
    // const keypair = account.fromSecretKey(secretKey)
    // if (keypair === null) {
    //   throw new Error('No Signer')
    // }
    const signedTx = await this.srcWallet.signTransaction(transferReceipt)
    console.log('hehrhehheee, sen transaction')
    // const I = await connection.sendRawTransaction(
    //   transferReceipt.serialize(),
    // )
    const txId = await sendTransaction(transferReceipt, connection)
    console.log('go heree')
    // await connection.confirmTransaction(txId)
    const info = await connection.getTransaction(txId)
    if (!info) {
      throw new Error('An error occurred while fetching the transaction info')
    }
    const sequence = parseSequenceFromLogSolana(info)
    const emitterAddress = getEmitterAddressEth(context.srcTokenBridgeAddress)
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
    console.log('hehrhehheee atetetette')
    // const txid = await connection.sendRawTransaction(
    //   transferReceipt.serialize(),
    // )
    const txId = await sendTransaction(receipt, connection)
    // await connection.confirmTransaction(txId)
    const info = await connection.getTransaction(txId)
    if (!info) {
      throw new Error('An error occurred while fetching the transaction info')
    }
    const sequence = parseSequenceFromLogSolana(info)
    const emitterAddress = getEmitterAddressEth(context.srcTokenBridgeAddress)
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
