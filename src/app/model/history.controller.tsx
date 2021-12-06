import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
  DEFAULT_TRANSFER_DATA,
  TransferData,
} from 'app/lib/wormhole/constant/wormhole'
import { WormholeContext } from 'app/lib/wormhole/context'
import { WormholeProvider } from 'app/lib/wormhole/provider'
import { WormholeTransfer } from 'app/lib/wormhole/transfer'

/**
 * Interface & Utility
 */

export type State = {
  wormhole: TransferState[]
  transaction: []
}

/**
 * Store constructor
 */
export type TransferState = {
  context: WormholeContext
  transferData: TransferData
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
    wormhole: history.sort((a, b) =>
      a.context.time < b.context.time ? 1 : -1,
    ),
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
  newHistory.unshift(stateTransfer)
  return { wormhole: newHistory }
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
      ),
})

export default slice.reducer
