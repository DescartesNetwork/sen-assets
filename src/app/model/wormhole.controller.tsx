import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { ChainId, CHAIN_ID_ETH, CHAIN_ID_SOLANA } from '@certusone/wormhole-sdk'
import { WalletInterface } from '@senswap/sen-js'
import { IEtherWallet } from 'app/lib/etherWallet/walletInterface'

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

const NAME = 'wormhole'
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

export const connectSourceWallet = createAsyncThunk<
  State,
  { wallet: IEtherWallet },
  { state: State }
>(`${NAME}/connectSourceWallet`, async ({ wallet }, { getState }) => {
  const state = getState()
  const address = await wallet.getAddress()
  return { ...state, sourceWalletAddress: address }
})

export const disconnectSourceWallet = createAsyncThunk<
  State,
  void,
  { state: State }
>(`${NAME}/disconnectSourceWallet`, async (_, { getState }) => {
  const state = getState()
  return { ...state, sourceWalletAddress: '' }
})

export const connectTargetWallet = createAsyncThunk<
  State,
  { wallet: WalletInterface },
  { state: State }
>(`${NAME}/connectTargetWallet`, async ({ wallet }, { getState }) => {
  const state = getState()
  const address = await wallet.getAddress()
  return { ...state, targetWalletAddress: address }
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
        connectSourceWallet.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        disconnectSourceWallet.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        connectTargetWallet.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      ),
})

export default slice.reducer
