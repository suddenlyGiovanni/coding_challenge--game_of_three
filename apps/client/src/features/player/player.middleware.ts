import { AnyAction } from '@reduxjs/toolkit'

import { Middleware } from 'redux'

import { socketService } from '../../socket-service'

import { RootState } from '../../store'

import { playerUpdateName } from './player.actions'

export const playerMiddleware: Middleware<unknown, RootState> = (storeAPI) => (
  next
) => (action: AnyAction) => {
  if (action.type === playerUpdateName.toString()) {
    console.log(action)
    const name = action.payload as string

    socketService.emitNameUpdated(name)
  }
  return next(action)
}
