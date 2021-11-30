import { ChainId, CHAIN_ID_ETH, CHAIN_ID_SOLANA } from '@certusone/wormhole-sdk'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

/**
 * Interface & Utility
 */

export type State = {
  // source wallet
  sourceChain: ChainId
  sourceWalletAddress: string
  // target wallet
  targetWalletAddress: string
  targetChain: ChainId
  // other
  amount: bigint
}

/**
 * Store constructor
 */

const NAME = 'account'
const initialState: State = {
  // source wallet
  sourceChain: CHAIN_ID_ETH,
  sourceWalletAddress: '',
  // target wallet
  targetWalletAddress: '',
  targetChain: CHAIN_ID_SOLANA,
  // other
  amount: BigInt(0),
}

/**
 * Actions
 */

export const setSourceChain = createAsyncThunk<
  State,
  { chainId: ChainId },
  { state: State }
>(`${NAME}/setSourceChain`, async ({ chainId }, { getState }) => {
  const state = getState()
  return { ...state, sourceChain: chainId }
})

export const connectSourceWallet = createAsyncThunk<
  State,
  void,
  { state: State }
>(`${NAME}/setSourceChain`, async (_, { getState }) => {
  const state = getState()
  return { ...state }
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
      setSourceChain.fulfilled,
      (state, { payload }) => void Object.assign(state, payload),
    ),
})

export default slice.reducer
