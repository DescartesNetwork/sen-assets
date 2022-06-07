import { configureStore } from '@reduxjs/toolkit'
import { devTools, bigintSerializationMiddleware } from 'app/model/devTools'

import settings from 'app/model/settings.controller'
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
    wohHistory
  },
})

export type AppState = ReturnType<typeof model.getState>
export type AppDispatch = typeof model.dispatch
export default model
