import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

/**
 * Interface & Utility
 */

export type State = {
  hiddenZeros: boolean
  hiddenUnknownTokens: boolean
}

/**
 * Store constructor
 */

const NAME = 'settings'
const initialState: State = {
  hiddenZeros: false,
  hiddenUnknownTokens: true,
}

/**
 * Actions
 */

export const setHiddenZeros = createAsyncThunk<
  State,
  { checked: boolean },
  { state: State }
>(`${NAME}/setHiddenZeros`, async ({ checked }, { getState }) => {
  const prevState = getState()
  return { ...prevState, hiddenZeros: checked }
})

export const setHiddenUnknownTokens = createAsyncThunk<
  State,
  { checked: boolean },
  { state: State }
>(`${NAME}/setHiddenUnknownTokens`, async ({ checked }, { getState }) => {
  const prevState = getState()
  return { ...prevState, hiddenUnknownTokens: checked }
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
      ),
})

export default slice.reducer
