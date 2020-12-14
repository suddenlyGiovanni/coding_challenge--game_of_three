// eslint-disable-next-line import/no-unresolved
import type { AppDispatch, RootAction, RootState } from '@MyTypes'
import type { Dispatch, Middleware, MiddlewareAPI } from '@reduxjs/toolkit'

export const traceMiddleware: Middleware = (
  storeAPI: MiddlewareAPI<AppDispatch, RootState>
) => (next: Dispatch<RootAction>) => (action: RootAction): unknown => {
  console.group('Redux trace middleware')

  console.info('dispatching')
  console.dir(action)

  const result = next(action) as unknown
  console.info('next state')
  console.dir(storeAPI.getState())

  console.groupEnd()

  return result
}
