import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import moment from 'moment'

import { TransLogService } from 'app/lib/stat/logic/translog'
import { TransferData } from 'app/lib/wormhole/constant/wormhole'
import { WormholeContext } from 'app/lib/wormhole/context'

import { TransferState } from 'app/lib/wormhole/constant/wormhole'
import { OptionsFetchSignature } from 'app/lib/stat/constants/transaction'
import { WohEthSol } from 'app/lib/wormhole'
import { utils } from '@senswap/sen-js'
import { SOL_ADDRESS } from 'app/constant/sol'
import { TransLog } from 'app/lib/stat/entities/trans-log'

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

const LIMIT_TRANSACTION = 15

const NAME = 'history'
const initialState: State = {
  wormhole: [],
  transaction: [],
}

const filterFunction = (transLog: TransLog) => {
  if (!transLog.programTransfer.length) return false
  return true
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
  const stateClone = JSON.parse(JSON.stringify(stateTransfer))

  const newHistory: TransferState[] = [...wormhole]
  for (const idx in newHistory) {
    if (newHistory[idx].context.id === id) {
      newHistory[idx] = stateClone
      return { wormhole: newHistory }
    }
  }
  return { wormhole: [stateClone, ...newHistory] }
})

export const fetchTransactionHistory = createAsyncThunk<
  { transaction: TransactionTransferHistoryData[] },
  { accountAddress: string; lastSignature?: string; isLoadMore: boolean },
  { state: { history: State } }
>(
  `${NAME}/fetchTransactionHistory`,
  async ({ accountAddress, lastSignature, isLoadMore }, { getState }) => {
    const splt = window.sentre.splt
    const limit = LIMIT_TRANSACTION
    const {
      history: { transaction },
    } = getState()

    const option: OptionsFetchSignature = {
      lastSignature,
      limit,
    }
    const walletAddress = await window.sentre.wallet?.getAddress()
    if (!walletAddress) throw new Error('Login fist')

    const transLogService = new TransLogService()
    const transLogData = await transLogService.collect(
      accountAddress,
      option,
      filterFunction,
    )

    let history: TransactionTransferHistoryData[] = []
    if (isLoadMore) history = [...transaction]
    for (const transLogItem of transLogData) {
      const historyItem = {} as TransactionTransferHistoryData
      const actionTransfer = transLogItem.programTransfer[0]
      if (!actionTransfer) continue
      if (!actionTransfer.destination || !actionTransfer.source) continue
      const des = actionTransfer.destination

      let associatedAddr = walletAddress
      if (des.mint !== SOL_ADDRESS)
        associatedAddr = await splt.deriveAssociatedAddress(
          walletAddress,
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
      historyItem.isReceive = associatedAddr === des.address ? true : false

      if (accountAddress === walletAddress && des.mint !== SOL_ADDRESS) continue
      history.push(historyItem)
    }

    return { transaction: history }
  },
)

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
