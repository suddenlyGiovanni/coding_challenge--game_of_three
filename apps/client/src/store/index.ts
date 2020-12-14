// eslint-disable-next-line import/no-unresolved
import type { RootAction, RootState, Services } from '@MyTypes'
import { configureStore } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'
import { createEpicMiddleware } from 'redux-observable'

import services from '../services'

import rootEpic from './root-epic'
import rootReducer from './root-reducer'

export const epicMiddleware = createEpicMiddleware<
  RootAction,
  RootAction,
  RootState,
  Services
>({
  dependencies: services,
})

//#region STORE INITIALIZATION
/** create store */
const store = configureStore({
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(epicMiddleware),
  reducer: rootReducer,
})
//#endregion

/** a type-safe useDispatch hook that can resolve types */
type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>()

epicMiddleware.run(rootEpic)

/* export store singleton instance */
export default store
