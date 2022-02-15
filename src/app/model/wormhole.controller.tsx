import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { CHAIN_ID_ETH, CHAIN_ID_SOLANA } from '@certusone/wormhole-sdk'
import { ChainId } from '@certusone/wormhole-sdk'
import { utils } from '@senswap/sen-js'

import { fetchTokenEther } from 'app/lib/wormhole/helper/ether'
import { WohTokenInfo, TransferState } from 'app/constant/types/wormhole'
import { web3Http } from 'app/lib/etherWallet/web3Config'
import { ETH_ADDRESS } from 'app/lib/wormhole/constant/ethConfig'
import { getEtherNetwork } from 'app/lib/wormhole/helper/utils'
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
  { wallet: any; chainID: ChainId; sourceToken: WohTokenInfo[] }
>(`${NAME}/connectSourceWallet`, async ({ wallet, chainID, sourceToken }) => {
  switch (chainID) {
    case CHAIN_ID_SOLANA:
      window.wormhole.sourceWallet.sol = wallet
      break
    case CHAIN_ID_ETH:
      window.wormhole.sourceWallet.ether = wallet
      break
    default:
      throw new Error('Wallet is not connected')
  }

  const address = await wallet.getAddress()
  // select fist token
  let tokenAddress = ''
  const tokens: Record<string, WohTokenInfo> = {}
  for (const token of sourceToken) {
    if (!token) continue
    if (!tokenAddress) {
      tokenAddress = token.address
    }
    tokens[token?.address] = token
  }

  return {
    sourceWalletAddress: address,
    sourceTokens: tokens,
    tokenAddress,
    sourceChain: chainID,
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
    let ethBalance = ''
    if (!!address) {
      ethBalance = await web3Http.eth.getBalance(
        web3Http.utils.toChecksumAddress(address),
      )
      const ethAddress = ETH_ADDRESS[getEtherNetwork()]
      if (!ethBalance)
        return {
          sourceTokens: tokens,
        }

      tokens[ethAddress] = {
        address: ethAddress,
        amount: Number(utils.undecimalize(BigInt(ethBalance), 18)),
        decimals: 18,
        logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/FeGn77dhg1KXRRFeSwwMiykZnZPw5JXW6naf2aQgZDQf/logo.png',
        name: 'Eth nav',
        symbol: 'ETH',
      }
    }
    return {
      sourceTokens: tokens,
    }
  },
)

export const updateSolTokens = createAsyncThunk<
  Partial<WohState>,
  { sourceTokens: Record<string, WohTokenInfo> }
>(`${NAME}/updateSolTokens`, ({ sourceTokens }) => {
  return {
    sourceTokens,
  }
})

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

export const disconnectTargetWallet = createAsyncThunk<Partial<WohState>>(
  `${NAME}/disconnectTargetWallet`,
  () => {
    return {
      targetWalletAddress: '',
    }
  },
)

export const connectTargetWallet = createAsyncThunk<
  { targetWalletAddress: string; targetChain: ChainId },
  { wallet: any; targetChain: ChainId }
>(`${NAME}/connectTargetWallet`, async ({ wallet, targetChain }) => {
  switch (targetChain) {
    case CHAIN_ID_SOLANA:
      window.wormhole.targetWallet.sol = wallet
      break
    case CHAIN_ID_ETH:
      window.wormhole.targetWallet.ether = wallet
      break
    default:
      throw new Error('Wallet is not connected')
  }
  const address = await wallet.getAddress()

  return { targetWalletAddress: address, targetChain }
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
  if (!sourceWallet?.ether) throw new Error('Wallet is not connected')
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
 * Actions
 */

export const changeSourceAndTargetChain = createAsyncThunk<
  Partial<WohState>,
  { sourceChain: ChainId; targetChain: ChainId }
>(`${NAME}/changeSourceAndTargetChain`, ({ sourceChain, targetChain }) => {
  return {
    sourceChain: sourceChain,
    targetChain: targetChain,
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
      )
      .addCase(
        updateSolTokens.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        changeSourceAndTargetChain.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        disconnectTargetWallet.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      ),
})

export default slice.reducer
