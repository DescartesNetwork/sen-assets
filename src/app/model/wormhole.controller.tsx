import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { ChainId, CHAIN_ID_ETH, CHAIN_ID_SOLANA } from '@certusone/wormhole-sdk'
import { WalletInterface } from '@senswap/sen-js'
import { IEtherWallet } from 'app/lib/etherWallet/walletInterface'
import { WormholeEtherSol } from 'app/lib/wormhole/wormhole'
import storage from 'shared/storage'
import { explorer } from 'shared/util'

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

export type State = {
  // source wallet
  sourceChain: ChainId
  sourceWalletAddress: string
  // target wallet
  targetWalletAddress: string
  targetChain: ChainId
  // other
  tokenAddress: string
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
  tokenAddress: '0xBA62BCfcAaFc6622853cca2BE6Ac7d845BC0f2Dc',
  amount: BigInt(10 ** 16),
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
  netWorkWallet.ether = wallet
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
  netWorkWallet.solana = wallet
  return { ...state, targetWalletAddress: address }
})

export const transfer = createAsyncThunk<State, void, { state: State }>(
  `${NAME}/transfer`,
  async (_, { getState }) => {
    const state = getState()
    const { ether: etherWallet, solana: solWallet } = netWorkWallet
    if (!etherWallet || !solWallet) return { ...state }
    
    const network = storage.get('network') || 'mainnet'
    const wormholeEther = new WormholeEtherSol(
      etherWallet,
      solWallet,
      state.tokenAddress,
      network,
    )
    const { attested } = await wormholeEther.isAttested()
    if (!attested) await wormholeEther.attest()
    const vaaHex = await wormholeEther.transfer(state.amount)
    const txId = await wormholeEther.redeem(vaaHex)

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
      ),
})

export default slice.reducer
