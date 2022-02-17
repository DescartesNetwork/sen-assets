import { ethers } from 'ethers'
import Web3 from 'web3'

import {
  INFURA_API_HTTP_URL,
  INFURA_PROJECT_ID_FOR_ETHERS,
  INFURA_SECRET_KEY_FOR_ETHERS,
} from '../wormhole/constant/ethConfig'
import { getEtherNetwork } from '../wormhole/helper/utils'
import { ES_API_KEY } from '../wormhole/transaction/etherScan/config'

export const provider = ethers.getDefaultProvider(getEtherNetwork(), {
  etherscan: ES_API_KEY[1],
  infura: {
    projectId: INFURA_PROJECT_ID_FOR_ETHERS,
    projectSecret: INFURA_SECRET_KEY_FOR_ETHERS,
  },
  alchemy: 'MRYIqv5IE0yh6-HULbmyzDY0IqxSaFqu',
  pocket: {
    applicationId: '620cce4a99eef60039c33049',
    applicationSecretKey: 'f444f35ca44324a477a2ef8b44f52367',
  },
})

const web3Provider: any = new Web3.providers.HttpProvider(
  INFURA_API_HTTP_URL[getEtherNetwork()],
)
export const web3ProviderEther = new ethers.providers.Web3Provider(web3Provider)
