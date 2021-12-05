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
  wormhole: HistoryWormhole[]
  transaction: []
}

/**
 * Store constructor
 */
export type HistoryWormhole = {
  context: WormholeContext
  transfer: TransferData
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
  wormhole: HistoryWormhole[]
}>(`${NAME}/fetchWormholeHistory`, async () => {
  const wormHole = await WormholeProvider.fetchAll()
  const transferData = await WormholeTransfer.fetchAll()
  const history: HistoryWormhole[] = []

  for (const id in transferData) {
    const context = wormHole[id]
    const transfer = transferData[id]
    if (!context) continue
    history.push({
      context,
      transfer,
    })
  }

  return {
    wormhole: history.sort((a, b) =>
      a.context.time < b.context.time ? 1 : -1,
    ),
  }
})

export const updateWormholeHistory = createAsyncThunk<
  {
    wormhole: HistoryWormhole[]
  },
  { provider: WormholeProvider },
  { state: { history: State } }
>(`${NAME}/updateWormholeHistory`, async ({ provider }, { getState }) => {
  const {
    history: { wormhole },
  } = getState()
  const id = provider.context.id

  const newHistory = wormhole.filter((val) => val.context.id !== id)
  newHistory.unshift({
    context: provider.context,
    transfer: provider.transferProvider.data || { ...DEFAULT_TRANSFER_DATA },
  })
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
