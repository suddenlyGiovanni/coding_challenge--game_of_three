import { createAction } from '@reduxjs/toolkit'

import { withPayloadType } from '../utils'

import type { PlayerSerialized } from '@game-of-three/contracts'

export const playersAddOne = createAction(
  'PLAYERS/ADD_PLAYER',
  withPayloadType<PlayerSerialized>()
)
export const playersRemoveOne = createAction(
  'PLAYERS/REMOVE_PLAYER',
  withPayloadType<PlayerSerialized>()
)
export const playersUpdateOne = createAction(
  'PLAYERS/UPDATE_PLAYER',
  withPayloadType<PlayerSerialized>()
)
