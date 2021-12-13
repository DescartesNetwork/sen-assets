import { CHAIN_ID_ETH, ChainId, CHAIN_ID_SOLANA } from '@certusone/wormhole-sdk'
import { EtherNetwork } from 'app/constant/types/addressSystem/ethereum.types'
import { SolNetWork } from 'app/constant/types/addressSystem/solona.types'

import { TokenInfo, WormholeContext } from 'app/constant/types/wormhole.type'
import {
  ETH_BRIDGE_ADDRESS,
  ETH_TOKEN_BRIDGE_ADDRESS,
} from './constant/ethConfig'
import {
  SOL_BRIDGE_ADDRESS,
  SOL_TOKEN_BRIDGE_ADDRESS,
} from './constant/solConfig'
import { WORMHOLE_RPC_HOST } from './constant/wormhole'
import { getEtherNetwork, getSolNetwork } from './helper'

export const createEtherSolContext = (
  tokenInfo: TokenInfo,
): WormholeContext => {
  const etherNetwork: EtherNetwork = getEtherNetwork()
  const solNetWork: SolNetWork = getSolNetwork()
  return {
    id: new Date().getTime() + '' + Math.random(),
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
  }
}
