import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { WormholeContext } from 'app/lib/wormhole/context'
import { WormholeProvider } from 'app/lib/wormhole/provider'
import { TransferData, WormholeTransfer } from 'app/lib/wormhole/transfer'

/**
 * Interface & Utility
 */

export type State = {
  wormhole: WormholeContext[]
  transaction: []
}

/**
 * Store constructor
 */
type HistoryWormhole = {
  context: WormholeContext
  transfer: TransferData
  status: 'pending' | 'error' | 'success'
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

  for (const key in transferData) {
    const wormholeContext = wormHole[key]
    if (!wormholeContext) continue
    const status = WormholeTransfer.checkStatus(wormholeContext.id)
    history.push({
      context: wormHole[key],
      transfer: transferData[key],
      status: status,
    })
  }
  console.log('history===>', history)
  return { wormhole: history }
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
      fetchWormholeHistory.fulfilled,
      (state, { payload }) => void Object.assign(state, payload),
    ),
})

export default slice.reducer
