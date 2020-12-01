import {
  combineReducers,
  configureStore,
  getDefaultMiddleware,
} from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'

import { reducer } from '../features'

//#region ROOT REDUCER
const rootReducer = combineReducers({ system: reducer })
export type RootState = ReturnType<typeof rootReducer>
//#endregion

//#region ROOT MIDDLEWARE
const rootMiddleware = [...getDefaultMiddleware<RootState>()]
export type RootMiddleware = typeof rootMiddleware
//#endregion

//#region STORE INITIALIZATION
export const store = configureStore({
  middleware: rootMiddleware,
  reducer: rootReducer,
})
//#endregion

//#region ROOT ACTIONS
export type AppDispatch = typeof store.dispatch

/** a type-safe useDispatch hook that can resolve types */
export const useAppDispatch = () => useDispatch<AppDispatch>()
//#endregion
