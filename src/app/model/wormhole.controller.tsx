import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { CHAIN_ID_ETH, CHAIN_ID_SOLANA } from '@certusone/wormhole-sdk'
import { WalletInterface } from '@senswap/sen-js'
import { ChainId } from '@certusone/wormhole-sdk'

import { fetchTokenEther } from 'app/lib/wormhole/helper/ether'
import { IEtherWallet } from 'app/lib/etherWallet/walletInterface'
import { WohTokenInfo, TransferState } from 'app/constant/types/wormhole'
import { getSolTokens } from 'app/lib/wormhole/helper/solana'

/**
 * Interface & Utility
 */
window.wormhole = {
  sourceWallet: {},
  targetWallet: {},
}

export type WohState = {
  // source wallet
  sourceTokens: Record<string, WohTokenInfo>
  sourceChain: ChainId
  sourceWalletAddress: string
  // target wallet
  targetWalletAddress: string
  targetChain: ChainId
  // other
  tokenAddress: string
  amount: string
  processId: string
  visible: boolean
  waiting: boolean
}

/**
 * Store constructor
 */

const NAME = 'wormhole'
const initialState: WohState = {
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
  waiting: false,
}

/**
 * Actions
 */

export const connectSourceWallet = createAsyncThunk<
  Partial<WohState>,
  { wallet: IEtherWallet; chainID: ChainId }
>(`${NAME}/connectSourceWallet`, async ({ wallet, chainID }) => {
  window.wormhole.sourceWallet.ether = wallet
  const address = await wallet.getAddress()
  // fetch wallet's tokens
  let tokenList
  if (chainID !== CHAIN_ID_SOLANA) {
    tokenList = getSolTokens(address)
  } else {
    tokenList = await fetchTokenEther(address)
  }

  console.log(tokenList, 'sksklsll')
  // const tokens: Record<string, WohTokenInfo> = {}
  // for (const token of tokenList) tokens[token.address] = token
  // // select fist token
  // const tokenAddress = tokenList[0]?.address || ''
  return {
    sourceWalletAddress: '0xf27F3863177A72957D409054c3f48a5fe35dF84B',
    sourceTokens: [],
    tokenAddress: '',
  }
})

export const fetchEtherTokens = createAsyncThunk<Partial<WohState>>(
  `${NAME}/fetchSourceTokens`,
  async () => {
    const wallet = window.wormhole.sourceWallet.ether
    if (!wallet) throw new Error('Wallet is not connected')
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
  },
)

export const disconnectSourceWallet = createAsyncThunk<
  WohState,
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
  { targetWalletAddress: string },
  { wallet: WalletInterface }
>(`${NAME}/connectTargetWallet`, async ({ wallet }) => {
  window.wormhole.targetWallet.sol = wallet
  const address = await wallet.getAddress()
  return { targetWalletAddress: address }
})

export const setSourceToken = createAsyncThunk<
  WohState,
  { tokenAddress?: string; amount?: string },
  { state: { wormhole: WohState } }
>(`${NAME}/setSourceToken`, async ({ tokenAddress, amount }, { getState }) => {
  const { wormhole } = getState()
  const newTokenAddress = tokenAddress || wormhole.tokenAddress
  const newAmount = amount === undefined ? wormhole.amount : amount
  return { ...wormhole, tokenAddress: newTokenAddress, amount: newAmount }
})

export const setProcess = createAsyncThunk<Partial<WohState>, { id: string }>(
  `${NAME}/setWormholeProcess`,
  async ({ id }) => {
    return {
      processId: id,
    }
  },
)

export const restoreTransfer = createAsyncThunk<
  WohState | void,
  { transferState: TransferState },
  { state: { wormhole: WohState } }
>(`${NAME}/restoreTransfer`, async ({ transferState }, { getState }) => {
  const { sourceWallet } = window.wormhole
  if (!sourceWallet.ether) throw new Error('Wallet is not connected')
  const { wormhole } = getState()
  const {
    context: { id, tokenInfo },
    transferData,
  } = transferState
  // restore data
  const dataRestore = JSON.parse(JSON.stringify(wormhole))
  const tokenAddr = tokenInfo.address
  dataRestore.tokenAddress = tokenAddr
  dataRestore.processId = id
  dataRestore.amount = transferData.amount
  dataRestore.sourceWalletAddress = transferData.from
  dataRestore.targetWalletAddress = transferData.to
  return { ...dataRestore }
})

export const setVisibleProcess = createAsyncThunk<
  Partial<WohState>,
  { visible: boolean }
>(`${NAME}/setVisibleProcess`, async ({ visible }) => {
  return { visible }
})

export const setWaiting = createAsyncThunk<
  Partial<WohState>,
  { waiting: boolean }
>(`${NAME}/setWaiting`, async ({ waiting }) => {
  return { waiting }
})

export const clearProcess = createAsyncThunk<
  Partial<WohState>,
  void,
  { state: { wormhole: WohState } }
>(`${NAME}/clearProcess`, async (_, { getState }) => {
  const { wormhole } = getState()
  const filterToken: Record<string, WohTokenInfo> = {}
  // clear process
  for (const token of Object.values(wormhole.sourceTokens)) {
    if (!!token.amount) filterToken[token.address] = { ...token }
  }
  const defaultToken = Object.values(filterToken)[0]?.address || ''

  return {
    visible: false,
    amount: '',
    processId: '',
    tokenAddress: defaultToken,
    sourceTokens: filterToken,
  }
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
      )
      .addCase(
        setWaiting.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      ),
})

export default slice.reducer
