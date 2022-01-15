import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { TransferState } from 'app/constant/types/wormhole'
import { restoreEther } from 'app/lib/wormhole/helper/ether'
import { EtherScan } from 'app/lib/wormhole/transaction/etherScan/etherScan'

/**
 * Interface & Utility
 */

export type State = Record<string, TransferState>

export type FetchWormholeParams = {
  historyState: State
  fromBlock: number
  count: number
}

const NAME = 'wohHistory'
const initialState: State = {}

/**
 * Store constructor
 */

export const fetchWohHistory = createAsyncThunk<
  FetchWormholeParams,
  {
    address: string
    minNeededTrx: number
    fromBLK?: number
    fetchedDays?: number
  }
>(
  `${NAME}/fetchWohHistory`,
  async ({
    address,
    minNeededTrx,
    fromBLK,
    fetchedDays,
  }): Promise<FetchWormholeParams> => {
    const etherScan = new EtherScan()
    const trans = await etherScan.getTransferHistory(address)
    const history = trans.sort(function (a, b) {
      return b.context.time - a.context.time
    })
    const historyState: State = {}
    for (const data of history) {
      historyState[data.context.id] = data
    }
    return { historyState, fromBlock: 0, count: 0 }
  },
)

export const restoreWohHistory = createAsyncThunk<
  State,
  { id: string },
  { state: { wohHistory: State } }
>(`${NAME}/restoreWohHistory`, async ({ id }, { getState }) => {
  const data = getState().wohHistory
  const prevData = data[id]
  const newData = await restoreEther(prevData)
  return { [id]: newData }
})

export const updateWohHistory = createAsyncThunk<
  State,
  { stateTransfer: TransferState }
>(`${NAME}/updateWormholeHistory`, async ({ stateTransfer }) => {
  const id = stateTransfer.context.id
  const stateClone = JSON.parse(JSON.stringify(stateTransfer))
  return { [id]: stateClone }
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
        updateWohHistory.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        fetchWohHistory.fulfilled,
        (state, { payload }) => void Object.assign(state, payload.historyState),
      )
      .addCase(
        restoreWohHistory.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      ),
})

export default slice.reducer
