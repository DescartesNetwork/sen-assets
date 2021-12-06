import { configureStore } from '@reduxjs/toolkit'
import { devTools, bigintSerializationMiddleware } from 'shared/devTools'

import settings from 'app/model/settings.controller'
import account from './account.controller'
import wormhole from './wormhole.controller'
import history from './history.controller'
/**
 * Isolated store
 */
const model = configureStore({
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware(bigintSerializationMiddleware),
  devTools: devTools('myapp'),
  reducer: {
    history,
    settings,
    account,
    wormhole,
  },
})

export type AppState = ReturnType<typeof model.getState>
export type AppDispatch = typeof model.dispatch
export default model
