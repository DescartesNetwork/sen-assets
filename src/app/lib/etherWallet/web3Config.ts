import {
  INFURA_API_HTTP_URL,
  INFURA_API_WSS_URL,
} from '../wormhole/constant/ethConfig'

const Web3 = require('web3')

export const web3Http = new Web3(
  // Replace YOUR-PROJECT-ID with a Project ID from your Infura Dashboard
  new Web3.providers.HttpProvider(INFURA_API_HTTP_URL.goerli),
)

export const web3Wss = new Web3(
  // Replace YOUR-PROJECT-ID with a Project ID from your Infura Dashboard
  new Web3.providers.WebsocketProvider(INFURA_API_WSS_URL.goerli),
)
