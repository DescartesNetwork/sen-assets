import {
  TransactionDataPerAddress,
  WohTokenInfo,
} from 'app/constant/types/wormhole'
import axios from 'axios'
import { MORALIS_INFO } from '../constant/ethConfig'
import { getEtherNetwork } from './utils'

export class Moralis {
  static getNetworkName() {
    const etherNetwork = getEtherNetwork()
    if (etherNetwork !== 'mainnet') return etherNetwork
    return 'eth'
  }

  static async fetchTokens(walletAddr: string) {
    const { data } = await axios({
      method: 'get',
      url: `${
        MORALIS_INFO.url
      }/${walletAddr}/erc20?chain=${Moralis.getNetworkName()}`,
      headers: {
        'X-API-Key': MORALIS_INFO.apiKey,
      },
    })
    return data
  }

  static async fetchTransactions(walletAddr: string) {
    const { data }: { data: TransactionDataPerAddress } = await axios({
      method: 'get',
      url: `${
        MORALIS_INFO.url
      }/${walletAddr}?chain=${Moralis.getNetworkName()}`,
      headers: {
        'X-API-Key': MORALIS_INFO.apiKey,
      },
    })
    return data.result
  }

  static async fetchInfoAToken(address: string): Promise<WohTokenInfo> {
    const { data } = await axios({
      method: 'get',
      url: `${
        MORALIS_INFO.url
      }/erc20/metadata?chain=${Moralis.getNetworkName()}&addresses=${address}`,
      headers: {
        'X-API-Key': MORALIS_INFO.apiKey,
      },
    })
    return data[0]
  }
}
