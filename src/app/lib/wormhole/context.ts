import { TokenEtherInfo } from 'app/model/wormhole.controller'
import storage from 'shared/storage'
import {
  EtherNetwork,
  ETH_BRIDGE_ADDRESS,
  ETH_TOKEN_BRIDGE_ADDRESS,
} from './config/ethConfig'
import {
  SolNetWork,
  SOL_BRIDGE_ADDRESS,
  SOL_TOKEN_BRIDGE_ADDRESS,
} from './config/solConfig'
import { WORMHOLE_RPC_HOST } from './config/wormhole'

export class WormholeContext {
  id: string
  // Source network
  srcTokenBridgeAddress: string
  srcBridgeAddress: string
  // Sol network
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
    this.id = this.generateId()
  }

  private generateId() {
    return new Date().getTime() + Math.random().toString()
  }
}