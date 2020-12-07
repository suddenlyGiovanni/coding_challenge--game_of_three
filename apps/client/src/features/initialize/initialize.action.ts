import { createAction } from '@reduxjs/toolkit'

import { withPayloadType } from '../utils'

import type { IServerState } from '@game-of-three/contracts'

export const initialize = createAction(
  'STATE/INITIALIZE',
  withPayloadType<IServerState>()
)
