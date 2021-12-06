import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { ChainId, CHAIN_ID_ETH, CHAIN_ID_SOLANA } from '@certusone/wormhole-sdk'
import { WalletInterface } from '@senswap/sen-js'

import { getEtherNetwork } from 'app/lib/wormhole/helper'
import { IEtherWallet } from 'app/lib/etherWallet/walletInterface'
import { fetchTokenEther } from 'app/lib/wormhole/helper'
import { TransferState } from 'app/lib/wormhole/constant/wormhole'

import { explorer } from 'shared/util'
import { WormholeTransfer } from 'app/lib/wormhole/transfer'

/**
 * Interface & Utility
 */
window.wormhole = {
  sourceWallet: {},
  targetWallet: {},
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
  processId: string
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
}

/**
 * Actions
 */

export const connectSourceWallet = createAsyncThunk<
  {
    sourceWalletAddress: string
    sourceTokens: Record<string, TokenEtherInfo>
    tokenAddress: string
  },
  { wallet: IEtherWallet }
>(`${NAME}/connectSourceWallet`, async ({ wallet }) => {
  window.wormhole.sourceWallet.ether = wallet
  const address = await wallet.getAddress()
  const etherNetwork = getEtherNetwork()
  // fetch wallet's tokens
  const tokenList = await fetchTokenEther(address, etherNetwork)
  const tokens: Record<string, TokenEtherInfo> = {}
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
  const newAmount = amount || wormhole.amount
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

export const transfer = createAsyncThunk<
  { processId: string },
  { onUpdate: (state: TransferState) => void },
  { state: { wormhole: State } }
>(`${NAME}/transfer`, async ({ onUpdate }, { getState, dispatch }) => {
  const {
    wormhole: { sourceTokens, tokenAddress, amount, processId },
  } = getState()

  try {
    const tokenTransfer = sourceTokens[tokenAddress]
    const { sourceWallet, targetWallet } = window.wormhole
    if (!sourceWallet.ether || !targetWallet.sol || !tokenTransfer)
      throw new Error('Login fist')

    let amountTransfer = amount
    let wormholeEther = new WormholeTransfer(
      sourceWallet.ether,
      targetWallet.sol,
      tokenTransfer,
    )
    // Restore with process ID
    if (processId) {
      await wormholeEther.restore(processId)
      amountTransfer = wormholeEther.data?.amount || '0'
      const stateTransfer = wormholeEther.getState()
      onUpdate(stateTransfer)
    }
    const txId = await wormholeEther.transfer(amountTransfer, onUpdate)
    window.notify({
      type: 'success',
      description: 'Transfer successfully',
      onClick: () => window.open(explorer(txId), '_blank'),
    })
  } catch (error) {
    window.notify({ type: 'error', description: (error as any).message })
    await dispatch(setProcess({}))
  } finally {
    return { processId: '' }
  }
})

export const restoreTransfer = createAsyncThunk<
  State | void,
  { historyData: TransferState },
  { state: { wormhole: State } }
>(`${NAME}/restoreTransfer`, async ({ historyData }, { getState }) => {
  try {
    const { sourceWallet } = window.wormhole
    if (!sourceWallet.ether) throw new Error('Login fist')
    const { wormhole } = getState()
    const { context } = historyData
    // restore data
    const dataRestore = { ...wormhole }
    dataRestore.tokenAddress = context.tokenInfo.address
    dataRestore.processId = context.id
    return { ...dataRestore }
  } catch (error) {
    window.notify({ type: 'error', description: (error as any).message })
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
        transfer.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        restoreTransfer.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        setProcess.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      ),
})

export default slice.reducer
