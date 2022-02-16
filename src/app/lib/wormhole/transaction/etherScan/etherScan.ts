import axios from 'axios'

import { TxData } from './constant'
import { ENDPOINT_URLS, ES_API_KEY, LIMIT } from './config'
import { getEtherNetwork } from '../../helper/utils'

export class EtherScan {
  private apiKey: string
  constructor() {
    this.apiKey = this.getApiKey()
  }

  private getApiKey = () => {
    const randKey = Math.floor(Math.random() * (ES_API_KEY.length - 1))
    return ES_API_KEY[randKey] || ES_API_KEY[0]
  }

  private getEndpoint = () => {
    return ENDPOINT_URLS[getEtherNetwork()]
  }
  private fetchListTx = async (address: string): Promise<TxData[]> => {
    try {
      const url = `${this.getEndpoint()}/api?module=account&action=txlist&address=${address}&page=1&offset=${LIMIT}&startblock=0&endblock=99999999&sort=asc&apikey=${
        this.apiKey
      }`
      const tokenTxs = await axios.get(url)
      return tokenTxs.data.result
    } catch (error) {
      return []
    }
  }

  // getTransferHistory = async (address: string): Promise<TransferState[]> => {
  //   let listTx = await this.fetchListTx(address)
  //   const history: TransferState[] = []
  //   await Promise.all(
  //     listTx.map(async (tx) => {
  //       try {
  //         const transferState = await createTransferState(tx)
  //         if (transferState) history.push(transferState)
  //       } catch (error) {}
  //     }),
  //   )
  //   return history
  // }
}
