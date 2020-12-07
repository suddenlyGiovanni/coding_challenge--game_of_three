import { createAction } from '@reduxjs/toolkit'

import { withPayloadType } from '../utils'

import type { IPlayerEntity } from '@game-of-three/contracts'

export const playersAddOne = createAction(
  'PLAYERS/ADD_PLAYER',
  withPayloadType<IPlayerEntity>()
)
export const playersRemoveOne = createAction(
  'PLAYERS/REMOVE_PLAYER',
  withPayloadType<IPlayerEntity>()
)
export const playersUpdateOne = createAction(
  'PLAYERS/UPDATE_PLAYER',
  withPayloadType<IPlayerEntity>()
)
