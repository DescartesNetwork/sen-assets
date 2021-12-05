import { Connection } from '@solana/web3.js'
import {
  CHAIN_ID_ETH,
  getForeignAssetSolana,
  getOriginalAssetEth,
} from '@certusone/wormhole-sdk'
import { account, WalletInterface } from '@senswap/sen-js'

import { TokenEtherInfo } from 'app/model/wormhole.controller'
import { IEtherWallet } from '../etherWallet/walletInterface'
import { WormholeTransfer } from './transfer'
import { WormholeContext } from './context'
import { WormholeStoreKey } from './constant/wormhole'
import { getWormholeDb, setWormholeDb } from './helper'

export class WormholeProvider {
  context: WormholeContext
  transferProvider: WormholeTransfer
  // wallet provider
  srcWallet: IEtherWallet
  targetWallet: WalletInterface
  // connection
  connection: Connection
  callbackUpdate: (wormhole: WormholeProvider) => void
  constructor(
    sourceWallet: IEtherWallet,
    targetWallet: WalletInterface,
    tokenInfo: TokenEtherInfo,
    callbackUpdate: (wormhole: WormholeProvider) => void,
  ) {
    this.srcWallet = sourceWallet
    this.targetWallet = targetWallet
    this.context = new WormholeContext(tokenInfo)
    this.connection = window.sentre.splt.connection
    this.callbackUpdate = callbackUpdate
    this.transferProvider = new WormholeTransfer(this)
  }

  static fetchAll = async (): Promise<Record<string, WormholeContext>> => {
    const data = await getWormholeDb<Record<string, WormholeContext>>(
      WormholeStoreKey.Provider,
    )
    return data || {}
  }

  static restore = async (
    processId: string,
    callbackUpdate: (wormhole: WormholeProvider) => void,
  ) => {
    // get context data
    const store = await WormholeProvider.fetchAll()
    const data = store[processId]
    if (!data) throw new Error('Invalid context id')
    // get wallet provider
    const {
      sourceWallet: { ether },
      targetWallet: { sol },
    } = window.wormhole
    if (!ether || !sol) throw new Error('Login fist')
    // restore wormhole context
    const wormhole = new WormholeProvider(
      ether,
      sol,
      data.tokenInfo,
      callbackUpdate,
    )
    wormhole.context = data
    wormhole.context.time = new Date().getTime()
    // restore transfer context
    await wormhole.transferProvider.restore()
    return wormhole
  }

  backup = async () => {
    if (!this.context) throw new Error('Invalid context')
    const contextData = await WormholeProvider.fetchAll()
    contextData[this.context.id] = this.context
    setWormholeDb(WormholeStoreKey.Provider, contextData)
  }

  /**
   * Check token is whether or not attested
   * @returns isAttested
   */

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

  /**
   * Transfer: to brigde tokens from origin chain to destination chain
   * The token must be attested beforehand
   * @param amount
   * @returns
   */
  transfer = async (amount: string) => {
    return this.transferProvider.transfer(amount)
  }
}
