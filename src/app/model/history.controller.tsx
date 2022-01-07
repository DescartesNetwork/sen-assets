import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import moment from 'moment'
import { utils } from '@senswap/sen-js'

import { SOL_ADDRESS } from 'app/constant/sol'
import { TransactionTransferHistoryData } from 'app/constant/types/history'
import { TransLog } from 'app/lib/stat/entities/trans-log'
import AssetsService from 'app/lib/stat/logic/assets/assets'
import { DataLoader } from 'shared/dataloader'

/**
 * Interface & Utility
 */

/**
 * Store constructor
 */

export type State = {
  transaction: TransactionTransferHistoryData[]
}

const NAME = 'history'
const initialState: State = {
  transaction: [],
}

const getWalletAddr = async () => {
  const walletAddress = await window.sentre.wallet?.getAddress()
  if (!walletAddress) throw new Error('Wallet is not connected')
  return walletAddress
}

const parseTransLog = async (accountAddress: string, transLog: TransLog) => {
  const walletAddress = await DataLoader.load('getWalletAddress', getWalletAddr)
  const actionTransfer = transLog.programTransfer[0]
  if (!actionTransfer) return
  // validate action transfeer
  const source = actionTransfer.source
  const dst = actionTransfer.destination
  if (!dst || !source) return

  const mint = dst.mint
  const splt = window.sentre.splt
  // filter with wallet address
  let associatedAddr = walletAddress
  if (mint !== SOL_ADDRESS) {
    if (accountAddress === walletAddress) return
    associatedAddr = await splt.deriveAssociatedAddress(walletAddress, mint)
  }
  if (source.address !== associatedAddr && dst.address !== associatedAddr)
    return
  const historyItem: TransactionTransferHistoryData = {
    time: moment(transLog.blockTime * 1000).format('MMM DD, YYYY HH:mm'),
    key: transLog.signature,
    transactionId: transLog.signature,
    amount: Number(
      utils.undecimalize(BigInt(actionTransfer.amount), dst.decimals),
    ),
    from: source.address,
    to: dst.address,
    isReceive: associatedAddr === dst.address ? true : false,
    mint,
  }
  return historyItem
}

export const fetchTransactionHistory = createAsyncThunk<
  State,
  { accountAddress: string }
>(`${NAME}/fetchTransactionHistory`, async ({ accountAddress }) => {
  const walletAddress = await window.sentre.wallet?.getAddress()
  if (!walletAddress) throw new Error('Wallet is not connected')

  const transLogService = new AssetsService(accountAddress)
  const transLogData = await transLogService.fetchHistory()

  let newHistory: TransactionTransferHistoryData[] = []

  await Promise.all(
    transLogData.map(async (transLogItem) => {
      const historyItem = await parseTransLog(accountAddress, transLogItem)
      if (historyItem) newHistory.push(historyItem)
    }),
  )
  return { transaction: newHistory }
})

/**
 * Usual procedure
 */

const slice = createSlice({
  name: NAME,
  initialState,
  reducers: {},
  extraReducers: (builder) =>
    void builder.addCase(
      fetchTransactionHistory.fulfilled,
      (state, { payload }) => void Object.assign(state, payload),
    ),
})

export default slice.reducer
