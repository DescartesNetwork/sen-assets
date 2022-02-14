import { CHAIN_ID_ETH, CHAIN_ID_SOLANA } from '@certusone/wormhole-sdk'

import { WohTokenInfo, WormholeContext } from 'app/constant/types/wormhole'
import { Net } from 'shared/runtime'
import {
  EtherNetwork,
  ETH_BRIDGE_ADDRESS,
  ETH_TOKEN_BRIDGE_ADDRESS,
} from './constant/ethConfig'
import {
  SOL_BRIDGE_ADDRESS,
  SOL_TOKEN_BRIDGE_ADDRESS,
} from './constant/solConfig'
import { WORMHOLE_RPC_HOST } from './constant/wormhole'
import { getEtherNetwork, getSolNetwork } from './helper/utils'

export const getEtherContext = () => {
  const etherNetwork: EtherNetwork = getEtherNetwork()
  return {
    chainId: CHAIN_ID_ETH,
    tokenBridgeAddress: ETH_TOKEN_BRIDGE_ADDRESS[etherNetwork],
    bridgeAddress: ETH_BRIDGE_ADDRESS[etherNetwork],
  }
}

export const getSolContext = () => {
  const solNetWork: Net = getSolNetwork()
  return {
    chainId: CHAIN_ID_SOLANA,
    tokenBridgeAddress: SOL_TOKEN_BRIDGE_ADDRESS[solNetWork],
    bridgeAddress: SOL_BRIDGE_ADDRESS[solNetWork],
  }
}

export const createEtherSolContext = (
  tokenInfo: WohTokenInfo,
): WormholeContext => {
  const solNetWork: Net = getSolNetwork()
  const etherContext = getEtherContext()
  return {
    id: new Date().getTime() + '' + Math.random(),
    time: new Date().getTime(),
    // Source network
    srcChainId: etherContext.chainId,
    srcTokenBridgeAddress: etherContext.tokenBridgeAddress,
    srcBridgeAddress: etherContext.bridgeAddress,
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

export const createSolEtherContext = (
  tokenInfo: WohTokenInfo,
): WormholeContext => {
  const solNetWork: Net = getSolNetwork()
  const solContext = getSolContext()
  const { chainId, tokenBridgeAddress, bridgeAddress } = getEtherContext()

  return {
    id: new Date().getTime() + '' + Math.random(),
    time: new Date().getTime(),
    // Source network
    srcChainId: solContext.chainId,
    srcTokenBridgeAddress: solContext.tokenBridgeAddress,
    srcBridgeAddress: solContext.bridgeAddress,
    // Eth network
    targetChainId: chainId,
    targetTokenBridgeAddress: tokenBridgeAddress,
    targetBridgeAddress: bridgeAddress,
    // Wormhole
    wormholeRpc: WORMHOLE_RPC_HOST[solNetWork],
    // Token
    tokenInfo: tokenInfo,
  }
}
