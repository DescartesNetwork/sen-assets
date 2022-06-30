import { configureStore } from '@reduxjs/toolkit'
import { devTools, bigintSerializationMiddleware } from 'model/devTools'

import settings from 'model/settings.controller'
import account from './account.controller'
import wormhole from './wormhole.controller'
import wohHistory from './wohHistory.controller'
import transHistory from './history.controller'
/**
 * Isolated store
 */
const model = configureStore({
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware(bigintSerializationMiddleware),
  devTools: devTools(process.env.REACT_APP_ID as string),
  reducer: {
    history: transHistory,
    settings,
    account,
    wormhole,
    wohHistory,
  },
})

export type AppState = ReturnType<typeof model.getState>
export type AppDispatch = typeof model.dispatch
export default model
