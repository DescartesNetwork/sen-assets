import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

/**
 * Interface & Utility
 */

export type State = {
  hiddenZeros: boolean
  hiddenUnknownTokens: boolean
  hiddenUnknownNFTs: boolean
}

/**
 * Store constructor
 */

const NAME = 'settings'
const initialState: State = {
  hiddenZeros: false,
  hiddenUnknownTokens: true,
  hiddenUnknownNFTs: true,
}

/**
 * Actions
 */

export const setHiddenZeros = createAsyncThunk<
  State,
  { checked: boolean },
  { state: { settings: State } }
>(`${NAME}/setHiddenZeros`, async ({ checked }, { getState }) => {
  const { settings } = getState()
  return { ...settings, hiddenZeros: checked }
})

export const setHiddenUnknownTokens = createAsyncThunk<
  State,
  { checked: boolean },
  { state: { settings: State } }
>(`${NAME}/setHiddenUnknownTokens`, async ({ checked }, { getState }) => {
  const { settings } = getState()
  return { ...settings, hiddenUnknownTokens: checked }
})

export const setHiddenUnknownNFTs = createAsyncThunk<
  State,
  { checked: boolean },
  { state: { settings: State } }
>(`${NAME}/setHiddenUnknownNFTs`, async ({ checked }, { getState }) => {
  const { settings } = getState()
  return { ...settings, hiddenUnknownNFTs: checked }
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
        setHiddenZeros.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        setHiddenUnknownTokens.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        setHiddenUnknownNFTs.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      ),
})

export default slice.reducer
