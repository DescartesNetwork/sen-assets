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
import { getDB } from './helper'

const STORE_KEY = 'wormhole:provider'
export class WormholeProvider {
  context: WormholeContext
  step: number = 0
  // wallet provider
  srcWallet: IEtherWallet
  targetWallet: WalletInterface
  // connection
  connection: Connection
  callbackUpdate: () => void
  constructor(
    sourceWallet: IEtherWallet,
    targetWallet: WalletInterface,
    tokenInfo: TokenEtherInfo,
    callbackUpdate: () => void,
  ) {
    this.srcWallet = sourceWallet
    this.targetWallet = targetWallet
    this.context = new WormholeContext(tokenInfo)
    this.connection = window.sentre.splt.connection
    this.callbackUpdate = callbackUpdate
  }

  static fetchAll = async (): Promise<Record<string, WormholeContext>> => {
    const DB = await getDB()
    const db = await DB.getItem<Record<string, WormholeContext>>(STORE_KEY)
    return db || {}
  }

  restore = async () => {
    const contextId = this.context.id
    const store = await WormholeProvider.fetchAll()
    const data = store[contextId]
    if (!data) throw new Error('Invalid context id')
    this.context = data
  }

  backup = async () => {
    if (!this.context) throw new Error('Invalid context')
    const store = await WormholeProvider.fetchAll()
    store[this.context.id] = this.context
    const DB = await getDB()
    DB.setItem(STORE_KEY, store)
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
    const transferWormhole = new WormholeTransfer(this)
    return transferWormhole.transfer(amount)
  }
}
