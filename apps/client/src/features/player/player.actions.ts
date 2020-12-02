import { createAction } from '@reduxjs/toolkit'

import { withPayloadType } from '../utils'

import type { PlayerSerialized } from '@game-of-three/contracts'

export const playerUpdateName = createAction(
  'PLAYER/UPDATE_NAME',
  withPayloadType<string>()
)

export const playerUpdate = createAction(
  'PLAYER/UPDATE',
  withPayloadType<PlayerSerialized>()
)
