import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import moment from 'moment'
import { utils } from '@senswap/sen-js'

import { TransLogService } from 'app/lib/stat/logic/translog'

import { OptionsFetchSignature } from 'app/lib/stat/constants/transaction'
import { SOL_ADDRESS } from 'app/constant/sol'
import { TransactionTransferHistoryData } from 'app/constant/types/history'

/**
 * Interface & Utility
 */

const LIMIT_TRANSACTION = 15

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

export const fetchTransactionHistory = createAsyncThunk<
  State,
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
    const transLogData = await transLogService.collect(accountAddress, option)

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
    void builder.addCase(
      fetchTransactionHistory.fulfilled,
      (state, { payload }) => void Object.assign(state, payload),
    ),
})

export default slice.reducer
