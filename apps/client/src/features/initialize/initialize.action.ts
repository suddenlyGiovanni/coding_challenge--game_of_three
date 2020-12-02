import { createAction } from '@reduxjs/toolkit'

import { withPayloadType } from '../utils'

import type { ServerState } from '@game-of-three/contracts'

export const initialize = createAction(
  'STATE/INITIALIZE',
  withPayloadType<ServerState>()
)
