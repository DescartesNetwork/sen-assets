import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { State } from 'app/constant/types/account.types'

const NAME = 'account'
const initialState: State = {
  accountSelected: '',
}

/**
 * Actions
 */

export const selectAccount = createAsyncThunk<State, { account: string }>(
  `${NAME}/selectAccount`,
  async ({ account }) => {
    return { accountSelected: account }
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
    void builder.addCase(
      selectAccount.fulfilled,
      (state, { payload }) => void Object.assign(state, payload),
    ),
})

export default slice.reducer
