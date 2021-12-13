import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { State } from 'app/constant/types/setting.types'

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
