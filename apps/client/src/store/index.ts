import { configureStore } from '@reduxjs/toolkit'

import { useDispatch } from 'react-redux'

import { rootMiddleware } from './root-middleware'

import { rootReducer } from './root-reducer'

//#region STORE INITIALIZATION
export const store = configureStore({
  middleware: rootMiddleware,
  reducer: rootReducer,
})
//#endregion

//#region ROOT ACTIONS
export type AppDispatch = typeof store.dispatch
export type { RootState } from './root-reducer'
export type { RootMiddleware } from './root-middleware'

/** a type-safe useDispatch hook that can resolve types */
export const useAppDispatch = () => useDispatch<AppDispatch>()
//#endregion
