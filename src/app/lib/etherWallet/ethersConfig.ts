import { ethers } from 'ethers'
import Web3 from 'web3'

import {
  INFURA_API_HTTP_URL,
  INFURA_PROJECT_ID_FOR_ETHERS,
  INFURA_SECRET_KEY_FOR_ETHERS,
} from '../wormhole/constant/ethConfig'
import { getEtherNetwork } from '../wormhole/helper/utils'

export const provider = ethers.getDefaultProvider(getEtherNetwork(), {
  infura: {
    projectId: INFURA_PROJECT_ID_FOR_ETHERS,
    projectSecret: INFURA_SECRET_KEY_FOR_ETHERS,
  },
})

const web3Provider: any = new Web3.providers.HttpProvider(
  INFURA_API_HTTP_URL[getEtherNetwork()],
)
export const web3ProviderEther = new ethers.providers.Web3Provider(web3Provider)
