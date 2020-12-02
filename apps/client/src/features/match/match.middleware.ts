import { AnyAction, Middleware } from '@reduxjs/toolkit'

import { socketService } from '../../socket-service'

import { RootState } from '../../store'

import { isMatchMove, isMatchNewGame } from './match.actions'

export const matchMiddleware: Middleware<unknown, RootState> = (storeAPI) => (
  next
) => (action: AnyAction) => {
  if (isMatchMove(action)) {
    socketService.emitMatchMove(action.payload)
  }

  if (isMatchNewGame(action)) {
    socketService.emitMakeMatch()
  }
  return next(action)
}
