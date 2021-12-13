import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { CHAIN_ID_ETH, CHAIN_ID_SOLANA } from '@certusone/wormhole-sdk'
import { WalletInterface } from '@senswap/sen-js'

import { fetchTokenEther } from 'app/lib/wormhole/helper/ether'
import { IEtherWallet } from 'app/lib/etherWallet/walletInterface'
import {
  WohTokenInfo,
  State,
  TransferState,
} from 'app/constant/types/wormhole'

/**
 * Interface & Utility
 */
window.wormhole = {
  sourceWallet: {},
  targetWallet: {},
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
  // process
  tokenAddress: '',
  amount: '',
  processId: '',
  visible: false,
}

/**
 * Actions
 */

export const connectSourceWallet = createAsyncThunk<
  {
    sourceWalletAddress: string
    sourceTokens: Record<string, WohTokenInfo>
    tokenAddress: string
  },
  { wallet: IEtherWallet }
>(`${NAME}/connectSourceWallet`, async ({ wallet }) => {
  window.wormhole.sourceWallet.ether = wallet
  const address = await wallet.getAddress()
  // fetch wallet's tokens
  const tokenList = await fetchTokenEther(address)
  const tokens: Record<string, WohTokenInfo> = {}
  for (const token of tokenList) {
    tokens[token.address] = token
  }
  // select fist token
  const tokenAddress = tokenList[0]?.address || ''
  return {
    sourceWalletAddress: address,
    sourceTokens: tokens,
    tokenAddress,
  }
})

export const fetchEtherTokens = createAsyncThunk<{
  sourceTokens: Record<string, WohTokenInfo>
}>(`${NAME}/fetchSourceTokens`, async () => {
  const wallet = window.wormhole.sourceWallet.ether
  if (!wallet) throw new Error('Login fist')
  const address = await wallet.getAddress()
  // fetch wallet's tokens
  const tokenList = await fetchTokenEther(address)
  const tokens: Record<string, WohTokenInfo> = {}
  for (const token of tokenList) {
    tokens[token.address] = token
  }
  return {
    sourceTokens: tokens,
  }
})

export const disconnectSourceWallet = createAsyncThunk<
  State,
  void,
  { state: { wormhole: State } }
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
  { targetWalletAddress: string },
  { wallet: WalletInterface }
>(`${NAME}/connectTargetWallet`, async ({ wallet }) => {
  window.wormhole.targetWallet.sol = wallet
  const address = await wallet.getAddress()
  return { targetWalletAddress: address }
})

export const setSourceToken = createAsyncThunk<
  State,
  { tokenAddress?: string; amount?: string },
  { state: { wormhole: State } }
>(`${NAME}/setSourceToken`, async ({ tokenAddress, amount }, { getState }) => {
  const { wormhole } = getState()
  const newTokenAddress = tokenAddress || wormhole.tokenAddress
  const newAmount = amount === undefined ? wormhole.amount : amount
  return { ...wormhole, tokenAddress: newTokenAddress, amount: newAmount }
})

export const setProcess = createAsyncThunk<
  State,
  { id?: string },
  { state: { wormhole: State } }
>(`${NAME}/setWormholeProcess`, async ({ id }, { getState }) => {
  const { wormhole } = getState()
  return { ...wormhole, processId: id || '' }
})

export const restoreTransfer = createAsyncThunk<
  State | void,
  { transferState: TransferState },
  { state: { wormhole: State } }
>(`${NAME}/restoreTransfer`, async ({ transferState }, { getState }) => {
  const { sourceWallet } = window.wormhole
  if (!sourceWallet.ether) throw new Error('Login fist')
  const { wormhole } = getState()
  const { context, transferData } = transferState
  // restore data
  const dataRestore = { ...wormhole }
  dataRestore.tokenAddress = context.tokenInfo.address
  dataRestore.processId = context.id
  dataRestore.amount = transferData.amount
  dataRestore.sourceWalletAddress = transferData.from
  dataRestore.targetWalletAddress = transferData.to
  return { ...dataRestore }
})

export const setVisibleProcess = createAsyncThunk<
  { visible: boolean },
  { visible: boolean }
>(`${NAME}/setVisibleProcess`, async ({ visible }) => {
  return { visible }
})

export const clearProcess = createAsyncThunk(
  `${NAME}/clearProcess`,
  async () => {
    return { visible: false, amount: '', processId: '' }
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
      )
      .addCase(
        restoreTransfer.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        setProcess.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        setVisibleProcess.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        fetchEtherTokens.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        clearProcess.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      ),
})

export default slice.reducer
