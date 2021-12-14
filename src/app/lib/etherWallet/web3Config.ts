import {
  ETH_TOKEN_BRIDGE_ADDRESS,
  INFURA_API_HTTP_URL,
  INFURA_API_WSS_URL,
} from '../wormhole/constant/ethConfig'
import { ABI_WORMHOLE, ABI_TOKEN_IMPLEMENTATION } from 'app/constant/abis'

const Web3 = require('web3')

export const web3Http = new Web3(
  // Replace YOUR-PROJECT-ID with a Project ID from your Infura Dashboard
  new Web3.providers.HttpProvider(INFURA_API_HTTP_URL.goerli),
)

export const web3Wss = new Web3(
  // Replace YOUR-PROJECT-ID with a Project ID from your Infura Dashboard
  new Web3.providers.WebsocketProvider(INFURA_API_WSS_URL.goerli),
)

export const web3WormholeContract = new web3Wss.eth.Contract(
  ABI_WORMHOLE,
  '0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B',
)
