import { Connection } from '@solana/web3.js'
import {
  CHAIN_ID_ETH,
  getForeignAssetSolana,
  getOriginalAssetEth,
} from '@certusone/wormhole-sdk'

import { WalletInterface } from '@senswap/sen-js'
import { TokenEtherInfo } from 'app/model/wormhole.controller'
import { IEtherWallet } from '../etherWallet/walletInterface'
import { createWohContext, WormholeContext } from './context'

export class WormholeProvider {
  context: WormholeContext
  // wallet provider
  srcWallet: IEtherWallet
  targetWallet: WalletInterface
  constructor(
    sourceWallet: IEtherWallet,
    targetWallet: WalletInterface,
    tokenInfo: TokenEtherInfo,
  ) {
    this.srcWallet = sourceWallet
    this.targetWallet = targetWallet
    this.context = createWohContext(tokenInfo)
  }

  getConnection() {
    const nodeUrl = window.sentre.splt.nodeUrl
    return new Connection(nodeUrl, 'confirmed')
  }

  isAttested = async (): Promise<{
    attested: boolean
    wrappedMintAddress: string | null
  }> => {
    const provider = await this.srcWallet.getProvider()
    const originAsset = await getOriginalAssetEth(
      this.context.srcTokenBridgeAddress,
      provider,
      this.context.tokenInfo.address,
      CHAIN_ID_ETH,
    )
    const wrappedMintAddress = await getForeignAssetSolana(
      this.getConnection(),
      this.context.targetTokenBridgeAddress,
      originAsset.chainId,
      originAsset.assetAddress,
    )

    return {
      attested: !!wrappedMintAddress,
      wrappedMintAddress,
    }
  }
}
