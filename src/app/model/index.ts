import { configureStore } from '@reduxjs/toolkit'
import { devTools, bigintSerializationMiddleware } from 'shared/devTools'

import settings from 'app/model/settings.controller'
import account from './account.controller'

/**
 * Isolated store
 */
const model = configureStore({
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware(bigintSerializationMiddleware),
  devTools: devTools('myapp'),
  reducer: {
    settings,
    account
  },
})
export type AppState = ReturnType<typeof model.getState>
export type AppDispatch = typeof model.dispatch
export default model
