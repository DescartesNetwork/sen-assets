import { account, WalletInterface } from '@senswap/sen-js'
import { Connection } from '@solana/web3.js'
import { ContractReceipt } from 'ethers'
import {
  attestFromEth,
  parseSequenceFromLogEth,
  getEmitterAddressEth,
  CHAIN_ID_ETH,
  postVaaSolana,
  createWrappedOnSolana,
  getForeignAssetSolana,
  transferFromEth,
  CHAIN_ID_SOLANA,
  redeemOnSolana,
  getOriginalAssetEth,
  approveEth,
  hexToUint8Array,
} from '@certusone/wormhole-sdk'

import {
  ETH_BRIDGE_ADDRESS,
  ETH_TOKEN_BRIDGE_ADDRESS,
} from './config/ethConfig'
import {
  SOL_BRIDGE_ADDRESS,
  SOL_TOKEN_BRIDGE_ADDRESS,
} from './config/solConfig'
import { WORMHOLE_RPC_HOST } from './config/wormhole'
import {
  getAssociatedAddress,
  getSignedVAAWithRetry,
  sendTransaction,
} from './helper'
import { IEtherWallet } from './../etherWallet/walletInterface'
export class WormholeEtherSol {
  // Source network
  srcWallet: IEtherWallet
  srcTokenBridgeAddress: string
  srcBridgeAddress: string
  // Sol network
  targetWallet: WalletInterface
  targetTokenBridgeAddress: string
  targetBridgeAddress: string
  connection: Connection = window.sentre.splt.connection
  // Wormhole
  wormholeRpc: string
  // Token
  tokenAddress: string

  constructor(
    sourceWallet: IEtherWallet,
    targetWallet: WalletInterface,
    tokenAddress: string,
    network: string = 'devnet',
  ) {
    //support mainnet + devnet
    if (!['mainnet', 'devnet'].includes(network))
      throw new Error(`Wormhole not support ${network} network`)
    const etherNetwork = network === 'mainnet' ? 'mainnet' : 'goerli'
    const solNetWork = network === 'mainnet' ? 'mainnet' : 'devnet'
    // Source network
    this.srcWallet = sourceWallet
    this.srcTokenBridgeAddress = ETH_TOKEN_BRIDGE_ADDRESS[etherNetwork]
    this.srcBridgeAddress = ETH_BRIDGE_ADDRESS[etherNetwork]
    // Sol network
    this.targetWallet = targetWallet
    this.targetTokenBridgeAddress = SOL_TOKEN_BRIDGE_ADDRESS[solNetWork]
    this.targetBridgeAddress = SOL_BRIDGE_ADDRESS[solNetWork]
    // Wormhole
    this.wormholeRpc = WORMHOLE_RPC_HOST[solNetWork]
    // Transfer
    this.tokenAddress = tokenAddress
  }

  /**
   * Check token is whether or not attested
   * @returns isAttested
   */
  isAttested = async (): Promise<{
    attested: boolean
    wrappedMintAddress: string | undefined
  }> => {
    const provider = await this.srcWallet.getProvider()

    const originAsset = await getOriginalAssetEth(
      this.srcTokenBridgeAddress,
      provider,
      this.tokenAddress,
      CHAIN_ID_ETH,
    )

    const wrappedMintAddress =
      (await getForeignAssetSolana(
        this.connection,
        this.targetTokenBridgeAddress,
        originAsset.chainId,
        originAsset.assetAddress,
      )) || undefined

    return {
      attested: account.isAddress(wrappedMintAddress),
      wrappedMintAddress,
    }
  }

  /**
   * Attest: to register a token (mint) to the bridge
   * If the token was registered, we don't have to do it again
   * THIS FUNCTION MUST BE CALLED ONCE FOR EACH TOKEN
   * @returns txId
   */

  attest = async (): Promise<string> => {
    const provider = await this.srcWallet.getProvider()
    const signer = await provider.getSigner()
    const payerAddress = await this.targetWallet.getAddress()
    // Check token
    const { attested } = await this.isAttested()
    if (attested) throw new Error('The token was attested')

    // Send attest
    const receipt = await attestFromEth(
      this.srcTokenBridgeAddress,
      signer,
      this.tokenAddress,
    )
    // Fetch attestion info
    const sequence = parseSequenceFromLogEth(receipt, this.srcBridgeAddress)
    const emitterAddress = getEmitterAddressEth(this.srcTokenBridgeAddress)
    // Get signedVAA
    const { vaaBytes } = await getSignedVAAWithRetry(
      this.wormholeRpc,
      CHAIN_ID_ETH,
      emitterAddress,
      sequence,
    )
    // Post signedVAA
    await postVaaSolana(
      this.connection,
      this.targetWallet.signTransaction,
      this.targetBridgeAddress,
      payerAddress,
      Buffer.from(vaaBytes),
    )
    const tx = await createWrappedOnSolana(
      this.connection,
      this.targetBridgeAddress,
      this.targetTokenBridgeAddress,
      payerAddress,
      vaaBytes,
    )
    const signedTx = await this.targetWallet.signTransaction(tx)
    const txId = await sendTransaction(signedTx, this.connection)
    return txId
  }

  /**
   * Transfer: to brigde tokens from origin chain to destination chain
   * The token must be attested beforehand
   * @param amount
   * @returns
   */
  transfer = async (amount: bigint) => {
    // Approve & transfer token ETH
    const transferReceipt = await this.transferSourceNetWork(amount)
    // Wormhole
    const vaaBytes = await this.transferWormholeNetWork(transferReceipt)
    //Key redeem
    const vaaHex = Buffer.from(vaaBytes).toString('hex')
    // Post signedVAA SOLANA
    const payerAddress = await this.targetWallet.getAddress()
    await postVaaSolana(
      this.connection,
      this.targetWallet.signTransaction,
      this.targetBridgeAddress,
      payerAddress,
      Buffer.from(vaaBytes),
    )
    // Redeem token
    return vaaHex
  }

  private async transferSourceNetWork(amount: bigint) {
    const provider = await this.srcWallet.getProvider()
    const signer = provider.getSigner()
    let { wrappedMintAddress } = await this.isAttested()
    if (!wrappedMintAddress) throw new Error('Attest the token first')

    await approveEth(
      this.srcTokenBridgeAddress,
      this.tokenAddress,
      signer,
      amount,
    )
    const dstAddress = await getAssociatedAddress(
      wrappedMintAddress,
      this.targetWallet,
    )
    const transferReceipt = await transferFromEth(
      this.srcTokenBridgeAddress,
      signer,
      this.tokenAddress,
      amount,
      CHAIN_ID_SOLANA,
      account.fromAddress(dstAddress).toBuffer(),
    )
    return transferReceipt
  }

  private async transferWormholeNetWork(transferReceipt: ContractReceipt) {
    const sequence = parseSequenceFromLogEth(
      transferReceipt,
      this.srcBridgeAddress,
    )
    const emitterAddress = getEmitterAddressEth(this.srcTokenBridgeAddress)
    // Get signedVAA
    const { vaaBytes } = await getSignedVAAWithRetry(
      this.wormholeRpc,
      CHAIN_ID_ETH,
      emitterAddress,
      sequence,
    )
    return vaaBytes
  }

  async redeem(signedVAAHex: string) {
    const payerAddress = await this.targetWallet.getAddress()
    const vaaBytes = hexToUint8Array(signedVAAHex)
    const tx = await redeemOnSolana(
      this.connection,
      this.targetBridgeAddress,
      this.targetTokenBridgeAddress,
      payerAddress,
      vaaBytes,
    )
    const signedTx = await this.targetWallet.signTransaction(tx)
    const txId = await sendTransaction(signedTx, this.connection)
    return txId
  }
}
