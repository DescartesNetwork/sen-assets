import { CHAIN_ID_SOLANA } from '@certusone/wormhole-sdk'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { account } from '@senswap/sen-js'

import { TransferState } from 'app/constant/types/wormhole'
import WormholeHistory from 'app/lib/stat/logic/assets/wormhole'
import { restoreEther } from 'app/lib/wormhole/helper/ether'
import { restoreSol } from 'app/lib/wormhole/helper/solana'
import { EtherScan } from 'app/lib/wormhole/transaction/etherScan/etherScan'

/**
 * Interface & Utility
 */

export type State = Record<string, TransferState>

export type FetchWormholeParams = {
  historyState: State
  newLastSig?: string
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
    lastSig?: string
    isFirstFetch?: boolean
  },
  { state: { wohHistory: State } }
>(
  `${NAME}/fetchWohHistory`,
  async (
    { address, lastSig, isFirstFetch },
    { getState },
  ): Promise<FetchWormholeParams> => {
    const currentState = getState().wohHistory
    let historyState: State = {}
    let trans
    let newLastSig

    if (account.isAddress(address)) {
      const wormholeHistory = new WormholeHistory()
      const { history, lastSig: signature } =
        await wormholeHistory.getTransferHistory(address, lastSig)
      trans = history
      newLastSig = signature
    } else {
      const etherScan = new EtherScan()
      trans = await etherScan.getTransferHistory(address)
    }

    const history = trans.sort(function (a, b) {
      return b.context.time - a.context.time
    })

    for (const data of history) {
      historyState[data.context.id] = data
    }

    if (!isFirstFetch) {
      Object.assign(historyState, currentState)
    }

    return { historyState, newLastSig }
  },
)

export const restoreWohHistory = createAsyncThunk<
  State,
  { id: string },
  { state: { wohHistory: State } }
>(`${NAME}/restoreWohHistory`, async ({ id }, { getState }) => {
  const data = getState().wohHistory
  const prevData = data[id]
  if (prevData.context.srcChainId === CHAIN_ID_SOLANA) {
    return { [id]: await restoreSol(prevData) }
  }

  let newData = await restoreEther(prevData)
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
        (state, { payload: { historyState } }) => historyState,
      )
      .addCase(
        restoreWohHistory.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      ),
})

export default slice.reducer
