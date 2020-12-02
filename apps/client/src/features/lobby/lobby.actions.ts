import { createAction } from '@reduxjs/toolkit'

import { withPayloadType } from '../utils'

import type { PlayerID } from '@game-of-three/contracts'

export const addPlayerToLobby = createAction(
  'LOBBY/ADD_PLAYER',
  withPayloadType<PlayerID>()
)
export const removePlayerFromLobby = createAction(
  'LOBBY/REMOVE_PLAYER',
  withPayloadType<PlayerID>()
)
