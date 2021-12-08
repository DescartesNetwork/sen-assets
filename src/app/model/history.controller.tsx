import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import moment from 'moment'

import { TransLogService } from 'app/lib/stat/logic/translog'
import { TransferData } from 'app/lib/wormhole/constant/wormhole'
import { WormholeContext } from 'app/lib/wormhole/context'

import { TransferState } from 'app/lib/wormhole/constant/wormhole'
import { WohEthSol } from 'app/lib/wormhole'
import { utils } from '@senswap/sen-js'

/**
 * Interface & Utility
 */

export type State = {
  transaction: TransactionTransferHistoryData[]
  wormhole: TransferState[]
}

/**
 * Store constructor
 */
export type HistoryWormhole = {
  context: WormholeContext
  transfer: TransferData
}
export type TransactionTransferHistoryData = {
  time: string
  transactionId: string
  from: string
  to: string
  amount: number
  key: string
  mint: string
  isReceive: boolean
}

const NAME = 'history'
const initialState: State = {
  wormhole: [],
  transaction: [],
}

/**
 * Actions
 */
export const fetchWormholeHistory = createAsyncThunk<{
  wormhole: TransferState[]
}>(`${NAME}/fetchWormholeHistory`, async () => {
  const listTransferState = await WohEthSol.fetchAll()
  const history: TransferState[] = Object.values(listTransferState)
  return {
    wormhole: history.reverse(),
  }
})

export const updateWormholeHistory = createAsyncThunk<
  {
    wormhole: TransferState[]
  },
  { stateTransfer: TransferState },
  { state: { history: State } }
>(`${NAME}/updateWormholeHistory`, async ({ stateTransfer }, { getState }) => {
  const {
    history: { wormhole },
  } = getState()
  const id = stateTransfer.context.id
  const newHistory = wormhole.filter((val) => val.context.id !== id)
  newHistory.unshift(JSON.parse(JSON.stringify(stateTransfer)))
  return { wormhole: newHistory }
})

export const fetchTransactionHistory = createAsyncThunk<
  { transaction: TransactionTransferHistoryData[] },
  { addressWallet: string }
>(`${NAME}/fetchTransactionHistory`, async ({ addressWallet }) => {
  const splt = window.sentre.splt
  const TranslogService = new TransLogService(addressWallet)
  const translogData = await TranslogService.collect()
  const history: TransactionTransferHistoryData[] = []

  for (const transLogItem of translogData) {
    const historyItem = {} as TransactionTransferHistoryData
    const actionTransfer = transLogItem.programTransfer[0]

    if (!actionTransfer) continue
    if (!actionTransfer.destination || !actionTransfer.source) continue

    const des = actionTransfer.destination
    const myWalletAddress = await splt.deriveAssociatedAddress(
      addressWallet,
      des.mint,
    )
    const time = new Date(transLogItem.blockTime * 1000)

    historyItem.time = moment(time).format('DD MMM, YYYY hh:mm')
    historyItem.key = transLogItem.signature
    historyItem.transactionId = transLogItem.signature
    historyItem.amount = Number(
      utils.undecimalize(BigInt(actionTransfer.amount), des.decimals),
    )
    historyItem.from = actionTransfer.source.address
    historyItem.to = des.address
    historyItem.mint = des.mint
    historyItem.isReceive = myWalletAddress === des.address ? true : false
    history.push(historyItem)
  }

  return { transaction: history }
})

/**
 * Usual procedure
 */

const slice = createSlice({
  name: NAME,
  initialState,
  reducers: {},
  extraReducers: (builder) =>
    void builder
      .addCase(
        fetchWormholeHistory.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        updateWormholeHistory.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        fetchTransactionHistory.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      ),
})

export default slice.reducer
