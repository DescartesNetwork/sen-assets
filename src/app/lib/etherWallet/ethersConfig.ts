import { ethers } from 'ethers'
import {
  INFURA_PROJECT_ID_2,
  INFURA_SECRET_KEY_2,
} from '../wormhole/constant/ethConfig'
import { getEtherNetwork } from '../wormhole/helper/utils'

export const provider = ethers.getDefaultProvider(getEtherNetwork(), {
  infura: {
    projectId: INFURA_PROJECT_ID_2,
    projectSecret: INFURA_SECRET_KEY_2,
  },
})
