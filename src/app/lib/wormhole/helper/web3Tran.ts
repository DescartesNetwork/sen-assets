import {
  RawEtherTransaction,
  TransactionEtherInfo,
  // TransferState,
} from 'app/constant/types/wormhole'
import { web3Http, web3WormholeContract } from 'app/lib/etherWallet/web3Config'
import { AVERAGE_BLOCK_PER_DAY, MAX_QUERIRED_DAYS } from '../constant/ethConfig'
// import { createTransferState } from './ether'

export class Web3Tran {
  fetchTransEther = async (address: string) => {
    const tran = await web3Http.eth.getPastLogs({
      fromBlock: 0,
      toBlock: 'latest',
      address,
    })
    return tran
  }

  // fetchTransactionEtherAddress2 = async (
  //   address: string,
  //   minNeededTrx: number,
  //   fromBLK?: number,
  //   fetchedDays?: number,
  // ): Promise<{
  //   transactions: TransactionEtherInfo[]
  //   fromBlock: number
  //   count: number
  // }> => {
  //   const currentBlockNumber: number = await web3Http.eth.getBlockNumber()
  //   const transactions: TransactionEtherInfo[] = []
  //   let fromBlock: number = fromBLK
  //     ? fromBLK - AVERAGE_BLOCK_PER_DAY
  //     : currentBlockNumber - AVERAGE_BLOCK_PER_DAY
  //   let toBlock: number = fromBlock + AVERAGE_BLOCK_PER_DAY
  //   let count: number = fetchedDays ? fetchedDays : 0

  //   while (transactions.length < minNeededTrx && count < MAX_QUERIRED_DAYS) {
  //     const tempTransactions: RawEtherTransaction[] =
  //       await web3WormholeContract.getPastEvents(
  //         'allEvents',
  //         {
  //           fromBlock,
  //           toBlock,
  //         },
  //         function (error: any, events: any) {},
  //       )
  //     await Promise.all(
  //       tempTransactions.map(async (tempTransaction) => {
  //         const value = await web3Http.eth.getTransaction(
  //           tempTransaction.transactionHash,
  //         )
  //         if (value.from.toLowerCase() !== address || !value.blockHash) return
  //         // const isTrxSol = await isTrxWithSol(tempTransaction)
  //         // if (isTrxSol === false) return
  //         const time = (await web3Http.eth.getBlock(value.blockHash))?.timestamp
  //         transactions.push({ ...value, block_timestamp: String(time) })
  //       }),
  //     )

  //     if (transactions.length < minNeededTrx) {
  //       toBlock = fromBlock
  //       fromBlock -= AVERAGE_BLOCK_PER_DAY
  //       count++
  //     }
  //   }
  //   return { transactions, fromBlock, count }
  // }

  private fetchTransactionEtherAddress = async (
    address: string,
  ): Promise<{
    transactions: TransactionEtherInfo[]
  }> => {
    const currentBlockNumber: number = await web3Http.eth.getBlockNumber()
    const transactions: TransactionEtherInfo[] = []
    let fromBlock: number =
      currentBlockNumber - AVERAGE_BLOCK_PER_DAY * MAX_QUERIRED_DAYS

    const tempTransactions: RawEtherTransaction[] =
      await web3WormholeContract.getPastEvents(
        'LogMessagePublished',
        {
          fromBlock,
          toBlock: 'latest',
        },
        function (error: any, events: any) {},
      )
    await Promise.all(
      tempTransactions.map(async (tempTransaction) => {
        const value = await web3Http.eth.getTransaction(
          tempTransaction.transactionHash,
        )
        if (value.from.toLowerCase() !== address || !value.blockHash) return
        const time = (await web3Http.eth.getBlock(value.blockHash))?.timestamp
        transactions.push({ ...value, block_timestamp: String(time) })
      }),
    )
    return { transactions }
  }

  // getTransferHistory = async (
  //   address: string,
  //   minNeededTrx: number,
  // ): Promise<{
  //   history: TransferState[]
  // }> => {
  //   let { transactions } = await this.fetchTransactionEtherAddress(address)
  //   const history: TransferState[] = []
  //   await Promise.all(
  //     transactions.map(async (tx) => {
  //       try {
  //         const transferState = await createTransferState(tx)
  //         if (transferState) history.push(transferState)
  //       } catch (error) {}
  //     }),
  //   )
  //   return { history }
  // }
}
