import { Connection } from '@solana/web3.js'
import {
  CHAIN_ID_ETH,
  getForeignAssetSolana,
  getOriginalAssetEth,
} from '@certusone/wormhole-sdk'
import { account, WalletInterface } from '@senswap/sen-js'

import { TokenEtherInfo } from 'app/model/wormhole.controller'
import { IEtherWallet } from '../etherWallet/walletInterface'

import { createWohContext, WormholeContext } from './context'

export class WormholeProvider {
  context: WormholeContext
  // wallet provider
  srcWallet: IEtherWallet
  targetWallet: WalletInterface
  // connection
  connection: Connection
  constructor(
    sourceWallet: IEtherWallet,
    targetWallet: WalletInterface,
    tokenInfo: TokenEtherInfo,
  ) {
    this.srcWallet = sourceWallet
    this.targetWallet = targetWallet
    this.context = createWohContext(tokenInfo)
    this.connection = window.sentre.splt.connection
  }

  isAttested = async (): Promise<{
    attested: boolean
    wrappedMintAddress: string | undefined
  }> => {
    if (!this.context) throw new Error('Invalid context wormhole')
    if (!this.srcWallet) throw new Error('Login Metamask fist')

    const provider = await this.srcWallet.getProvider()
    const originAsset = await getOriginalAssetEth(
      this.context.srcTokenBridgeAddress,
      provider,
      this.context.tokenInfo.address,
      CHAIN_ID_ETH,
    )
    const wrappedMintAddress =
      (await getForeignAssetSolana(
        this.connection,
        this.context.targetTokenBridgeAddress,
        originAsset.chainId,
        originAsset.assetAddress,
      )) || undefined

    return {
      attested: account.isAddress(wrappedMintAddress),
      wrappedMintAddress,
    }
  }
}
