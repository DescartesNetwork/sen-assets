import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

// import { ChainId, CHAIN_ID_ETH, CHAIN_ID_SOLANA } from '@certusone/wormhole-sdk'
import { ChainID } from '@certusone/wormhole-sdk/lib/proto/publicrpc/v1/publicrpc'
import { EtherWallet } from 'app/libWormhole/etherWallet'

const CHAIN_ID_ETH = ChainID.CHAIN_ID_ETHEREUM
const CHAIN_ID_SOLANA = ChainID.CHAIN_ID_SOLANA
type ChainId = ChainID
/**
 * Interface & Utility
 */

const etherWallet = new EtherWallet()

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
const getWalletAddress = async (chainId: ChainID) => {
  const { wallet } = window.sentre
  if (chainId === CHAIN_ID_SOLANA) {
    const walletAddress = await wallet?.getAddress()
    return walletAddress || ''
  }
  return ''
}

export const setSourceChain = createAsyncThunk<
  State,
  { chainId: ChainId },
  { state: State }
>(`${NAME}/setSourceChain`, async ({ chainId }, { getState }) => {
  const state = getState()
  const walletAddress = await getWalletAddress(chainId)
  return { ...state, sourceChain: chainId, sourceWalletAddress: walletAddress }
})

export const connectSourceWallet = createAsyncThunk<
  State,
  void,
  { state: State }
>(`${NAME}/connectSourceWallet`, async (_, { getState }) => {
  const state = getState()
  const address = await etherWallet.connect()
  return { ...state, sourceWalletAddress: address }
})

export const disconnectSourceWallet = createAsyncThunk<
  State,
  void,
  { state: State }
>(`${NAME}/connectSourceWallet`, async (_, { getState }) => {
  const state = getState()
  await etherWallet.disconnect()
  return { ...state, sourceWalletAddress: '' }
})

export const setTargetChain = createAsyncThunk<
  State,
  { chainId: ChainId },
  { state: State }
>(`${NAME}/setTargetChain`, async ({ chainId }, { getState }) => {
  const state = getState()
  const walletAddress = await getWalletAddress(chainId)
  return { ...state, targetChain: chainId, targetWalletAddress: walletAddress }
})

export const connectTargetWallet = createAsyncThunk<
  State,
  void,
  { state: State }
>(`${NAME}/connectTargetWallet`, async (_, { getState }) => {
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
    void builder
      .addCase(
        setSourceChain.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        connectSourceWallet.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        setTargetChain.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        connectTargetWallet.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      // .addCase(
      //   disconnectSourceWallet.fulfilled,
      //   (state, { payload }) => void Object.assign(state, payload),
      // ),
})

export default slice.reducer
