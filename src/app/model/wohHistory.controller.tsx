import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { TransferState } from 'app/constant/types/wormhole'
import {
  fetchEtherSolHistory,
  restoreEther,
} from 'app/lib/wormhole/helper/ether'

/**
 * Interface & Utility
 */

export type State = Record<string, TransferState>

const NAME = 'wohHistory'
const initialState: State = {}

/**
 * Store constructor
 */

export const fetchWohHistory = createAsyncThunk<State, { address: string }>(
  `${NAME}/fetchWohHistory`,
  async ({ address }) => {
    let etherHistory = await fetchEtherSolHistory(address)
    etherHistory = etherHistory.sort(function (a, b) {
      return a.context.time - b.context.time
    })
    const history: State = {}
    for (const data of etherHistory) {
      history[data.context.id] = data
    }
    return history
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
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        restoreWohHistory.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      ),
})

export default slice.reducer
