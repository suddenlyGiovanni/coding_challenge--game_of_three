import type { AnyAction, Middleware } from '@reduxjs/toolkit'

import type { RootState } from '../../store'

export const traceMiddleware: Middleware<unknown, RootState> = (storeAPI) => (
  next
) => (action: AnyAction) => {
  console.log('dispatching', action)
  const result = next(action)
  console.log('next state', storeAPI.getState())
  return result
}
