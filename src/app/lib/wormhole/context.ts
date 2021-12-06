import { CHAIN_ID_ETH, ChainId, CHAIN_ID_SOLANA } from '@certusone/wormhole-sdk'

import { TokenEtherInfo } from 'app/model/wormhole.controller'
import storage from 'shared/storage'
import {
  EtherNetwork,
  ETH_BRIDGE_ADDRESS,
  ETH_TOKEN_BRIDGE_ADDRESS,
} from './constant/ethConfig'
import {
  SolNetWork,
  SOL_BRIDGE_ADDRESS,
  SOL_TOKEN_BRIDGE_ADDRESS,
} from './constant/solConfig'
import { WORMHOLE_RPC_HOST } from './constant/wormhole'

export class WormholeContext {
  id: string
  time: number
  // Source network
  srcChainId: ChainId = CHAIN_ID_ETH
  srcTokenBridgeAddress: string
  srcBridgeAddress: string
  // Sol network
  targetChainId: ChainId = CHAIN_ID_SOLANA
  targetTokenBridgeAddress: string
  targetBridgeAddress: string
  // Wormhole
  wormholeRpc: string
  // Token
  tokenInfo: TokenEtherInfo
  //network
  etherNetwork: EtherNetwork
  solNetWork: SolNetWork

  constructor(tokenInfo: TokenEtherInfo) {
    let etherNetwork: EtherNetwork = 'goerli'
    const solNetWork: SolNetWork = storage.get('network') || 'mainnet'
    if (solNetWork === 'mainnet') etherNetwork = 'mainnet'
    // Ether network
    this.srcTokenBridgeAddress = ETH_TOKEN_BRIDGE_ADDRESS[etherNetwork]
    this.srcBridgeAddress = ETH_BRIDGE_ADDRESS[etherNetwork]
    // Sol network
    this.targetTokenBridgeAddress = SOL_TOKEN_BRIDGE_ADDRESS[solNetWork]
    this.targetBridgeAddress = SOL_BRIDGE_ADDRESS[solNetWork]
    // Wormhole
    this.wormholeRpc = WORMHOLE_RPC_HOST[solNetWork]
    this.etherNetwork = etherNetwork
    this.solNetWork = solNetWork
    // Transfer
    this.tokenInfo = tokenInfo
    this.id = new Date().getTime() + ''
    this.time = new Date().getTime()
  }
}
