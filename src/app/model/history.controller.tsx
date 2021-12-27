import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import moment from 'moment'
import { utils } from '@senswap/sen-js'

import { TransLogService } from 'app/lib/stat/logic/translog'

import { OptionsFetchSignature } from 'app/lib/stat/constants/transaction'
import { SOL_ADDRESS } from 'app/constant/sol'
import { TransactionTransferHistoryData } from 'app/constant/types/history'
import { TransLog } from 'app/lib/stat/entities/trans-log'

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

const getWalletAddr = async () => {
  const walletAddress = await window.sentre.wallet?.getAddress()
  if (!walletAddress) throw new Error('Login fist')
  return walletAddress
}

const parseTransLog = async (accountAddress: string, transLog: TransLog) => {
  const walletAddress = await getWalletAddr()
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
  { accountAddress: string; lastSignature?: string; isLoadMore: boolean },
  { state: { history: State } }
>(
  `${NAME}/fetchTransactionHistory`,
  async ({ accountAddress, lastSignature, isLoadMore }, { getState }) => {
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
      async (transLog) => {
        const data = await parseTransLog(accountAddress, transLog)
        return !!data
      },
    )

    let history: TransactionTransferHistoryData[] = []
    if (isLoadMore) history = [...transaction]

    for (const transLogItem of transLogData) {
      const historyItem = await parseTransLog(accountAddress, transLogItem)
      if (!historyItem) continue
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
