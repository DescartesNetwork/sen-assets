import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import moment from 'moment'

import { TransLogService } from 'app/lib/stat/logic/translog'
import { TransferData } from 'app/lib/wormhole/constant/wormhole'
import { WormholeContext } from 'app/lib/wormhole/context'

import { TransferState } from 'app/lib/wormhole/constant/wormhole'
import { WormholeTransfer } from 'app/lib/wormhole/transfer'
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
  from?: string
  to?: string
  amount?: number
  status: string
  key: string
  mint?: string
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
  const listTransferState = await WormholeTransfer.fetchAll()
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
  { programId: string }
>(`${NAME}/fetchTransactionHistory`, async ({ programId }) => {
  const splt = window.sentre.splt
  const useTranslogService = new TransLogService(programId)
  const collectData = await useTranslogService.collect()
  const history: TransactionTransferHistoryData[] = []
  const address = (await window.sentre.wallet?.getAddress()) || ''

  for (const transLogItem of collectData) {
    const translog = {} as TransactionTransferHistoryData
    if (transLogItem.programTransfer.length === 0) continue
    const actionTransfer = transLogItem.programTransfer[0]
    const myWalletAddress = await splt.deriveAssociatedAddress(
      address,
      actionTransfer.destination?.mint || '',
    )
    const time = new Date(transLogItem.blockTime * 1000)

    translog.time = moment(time).format('DD MMM, YYYY hh:mm')
    translog.key = transLogItem.signature
    translog.transactionId = transLogItem.programId

    translog.amount = Number(
      utils.undecimalize(
        BigInt(actionTransfer.amount),
        actionTransfer.destination?.decimals || 9,
      ),
    )
    translog.from = actionTransfer.source?.address
    translog.to = actionTransfer.destination?.address
    translog.status = 'success'
    translog.mint = actionTransfer.destination?.mint
    translog.isReceive =
      myWalletAddress === actionTransfer.destination?.address ? true : false
    history.push(translog)
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
