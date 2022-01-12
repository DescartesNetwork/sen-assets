import Web3 from 'web3'

import { ABI_IMPLEMENTATION } from '../wormhole/constant/abis/implementation'
import {
  ETH_BRIDGE_ADDRESS,
  INFURA_API_HTTP_URL,
  INFURA_API_WSS_URL,
} from '../wormhole/constant/ethConfig'
import { getEtherNetwork } from '../wormhole/helper/utils'
// const Web3 = require('web3')

export const web3Http = new Web3(
  // Replace YOUR-PROJECT-ID with a Project ID from your Infura Dashboard
  new Web3.providers.HttpProvider(INFURA_API_HTTP_URL[getEtherNetwork()]),
)

export const web3Wss = new Web3(
  // Replace YOUR-PROJECT-ID with a Project ID from your Infura Dashboard
  new Web3.providers.WebsocketProvider(INFURA_API_WSS_URL[getEtherNetwork()]),
)

export const web3WormholeContract = new web3Wss.eth.Contract(
  ABI_IMPLEMENTATION,
  ETH_BRIDGE_ADDRESS[getEtherNetwork()],
)
