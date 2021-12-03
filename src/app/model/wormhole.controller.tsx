import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { ChainId, CHAIN_ID_ETH, CHAIN_ID_SOLANA } from '@certusone/wormhole-sdk'
import { WalletInterface } from '@senswap/sen-js'

import storage from 'shared/storage'
import { explorer } from 'shared/util'

import { IEtherWallet } from 'app/lib/etherWallet/walletInterface'
import { WormholeProvider } from 'app/lib/wormhole/wormhole'
import { fetchTokenEther } from 'app/lib/wormhole/helper'

/**
 * Interface & Utility
 */
const netWorkWallet: {
  ether: IEtherWallet | null
  solana: WalletInterface | null
} = {
  ether: null,
  solana: null,
}

export type TokenEtherInfo = {
  balance: bigint
  decimals: number
  logo: string
  name: string
  symbol: string
  thumbnail: string
  address: string
  amount: number
}

const network = storage.get('network') || 'mainnet'
const etherNetwork = network === 'mainnet' ? 'mainnet' : 'goerli'

export type State = {
  // source wallet
  sourceTokens: Record<string, TokenEtherInfo>
  sourceChain: ChainId
  sourceWalletAddress: string
  // target wallet
  targetWalletAddress: string
  targetChain: ChainId
  // other
  tokenAddress: string
  amount: string
}

/**
 * Store constructor
 */

const NAME = 'wormhole'
const initialState: State = {
  // source wallet
  sourceTokens: {},
  sourceChain: CHAIN_ID_ETH,
  sourceWalletAddress: '',
  // target wallet
  targetWalletAddress: '',
  targetChain: CHAIN_ID_SOLANA,
  // other
  tokenAddress: '',
  amount: '',
}

/**
 * Actions
 */

export const connectSourceWallet = createAsyncThunk<
  State,
  { wallet: IEtherWallet },
  { state: any }
>(`${NAME}/connectSourceWallet`, async ({ wallet }, { getState }) => {
  const state = getState().wormhole
  const address = await wallet.getAddress()
  netWorkWallet.ether = wallet
  // fetch wallet's tokens
  const tokenList = await fetchTokenEther(address, etherNetwork)
  const tokens: Record<string, TokenEtherInfo> = {}
  for (const token of tokenList) {
    tokens[token.address] = token
  }
  // select fist token
  const tokenAddress = tokenList[0]?.address || ''

  return {
    ...state,
    sourceWalletAddress: address,
    sourceTokens: tokens,
    tokenAddress,
  }
})

export const disconnectSourceWallet = createAsyncThunk<
  State,
  void,
  { state: any }
>(`${NAME}/disconnectSourceWallet`, async (_, { getState }) => {
  const state = getState().wormhole
  return {
    ...state,
    sourceWalletAddress: '',
    sourceTokens: {},
    tokenAddress: '',
  }
})

export const connectTargetWallet = createAsyncThunk<
  State,
  { wallet: WalletInterface },
  { state: any }
>(`${NAME}/connectTargetWallet`, async ({ wallet }, { getState }) => {
  const state = getState().wormhole
  const address = await wallet.getAddress()
  netWorkWallet.solana = wallet
  return { ...state, targetWalletAddress: address }
})

export const setSourceToken = createAsyncThunk<
  State,
  { tokenAddress?: string; amount?: string },
  { state: any }
>(`${NAME}/setSourceToken`, async ({ tokenAddress, amount }, { getState }) => {
  const state = getState().wormhole
  const newTokenAddress = tokenAddress || state.tokenAddress
  const newAmount = amount || state.amount
  return { ...state, tokenAddress: newTokenAddress, amount: newAmount }
})

export const transfer = createAsyncThunk<State, void, { state: any }>(
  `${NAME}/transfer`,
  async (_, { getState }) => {
    const state = getState().wormhole
    const { sourceTokens, tokenAddress, amount } = state
    const tokenTransfer = sourceTokens[tokenAddress]
    // get wallet provider
    const { ether: etherWallet, solana: solWallet } = netWorkWallet
    if (!etherWallet || !solWallet || !tokenTransfer) return { ...state }

    const wormholeEther = new WormholeProvider(
      etherWallet,
      solWallet,
      tokenTransfer,
    )
    const txId = await wormholeEther.transfer(amount)
    window.notify({
      type: 'success',
      description: 'Transfer successfully',
      onClick: () => window.open(explorer(txId), '_blank'),
    })
    return { ...state }
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
      )
      .addCase(
        setSourceToken.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      ),
})

export default slice.reducer
