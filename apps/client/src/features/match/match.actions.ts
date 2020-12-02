import { AnyAction, createAction } from '@reduxjs/toolkit'

import { withPayloadType } from '../utils'

import type { IAction, IMatchStateSerialized } from '@game-of-three/contracts'

export const matchNewGame = createAction('MATCH/NEW_MATCH')

export const matchNewState = createAction(
  'SOCKET/MATCH/NEW_STATE',
  withPayloadType<IMatchStateSerialized<string, string, string>>()
)

export const matchMove = createAction('MATCH/MOVE', withPayloadType<IAction>())

//#region ACTIONS TYPES GUARDS

export const isMatchMove = (
  action: AnyAction
): action is ReturnType<typeof matchMove> => {
  return action.type === matchMove.toString()
}

export const isMatchNewGame = (
  action: AnyAction
): action is ReturnType<typeof matchNewGame> => {
  return action.type === matchNewGame.toString()
}

//#endregion
