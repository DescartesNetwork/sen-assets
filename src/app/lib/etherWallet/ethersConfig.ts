import { ethers } from 'ethers'
import {
  INFURA_PROJECT_ID,
  INFURA_SECRET_KEY,
} from '../wormhole/constant/ethConfig'
import { getEtherNetwork } from '../wormhole/helper/utils'

export const provider = ethers.getDefaultProvider(getEtherNetwork(), {
  infura: {
    projectId: INFURA_PROJECT_ID,
    projectSecret: INFURA_SECRET_KEY,
  },
})
