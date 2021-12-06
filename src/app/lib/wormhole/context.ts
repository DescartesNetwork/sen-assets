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

export type WormholeContext = {
  id: string
  time: number
  // Source network
  srcChainId: ChainId
  srcTokenBridgeAddress: string
  srcBridgeAddress: string
  // Sol network
  targetChainId: ChainId
  targetTokenBridgeAddress: string
  targetBridgeAddress: string
  // Wormhole
  wormholeRpc: string
  // Token
  tokenInfo: TokenEtherInfo
  //network
  etherNetwork: EtherNetwork
  solNetWork: SolNetWork
}

export const createWohContext = (
  tokenInfo: TokenEtherInfo,
): WormholeContext => {
  let etherNetwork: EtherNetwork = 'goerli'
  const solNetWork: SolNetWork = storage.get('network') || 'mainnet'
  if (solNetWork === 'mainnet') etherNetwork = 'mainnet'

  return {
    id: new Date().getTime() + '',
    time: new Date().getTime(),
    // Source network
    srcChainId: CHAIN_ID_ETH,
    srcTokenBridgeAddress: ETH_TOKEN_BRIDGE_ADDRESS[etherNetwork],
    srcBridgeAddress: ETH_BRIDGE_ADDRESS[etherNetwork],
    // Sol network
    targetChainId: CHAIN_ID_SOLANA,
    targetTokenBridgeAddress: SOL_TOKEN_BRIDGE_ADDRESS[solNetWork],
    targetBridgeAddress: SOL_BRIDGE_ADDRESS[solNetWork],
    // Wormhole
    wormholeRpc: WORMHOLE_RPC_HOST[solNetWork],
    // Token
    tokenInfo: tokenInfo,
    //network
    etherNetwork: etherNetwork,
    solNetWork: solNetWork,
  }
}
