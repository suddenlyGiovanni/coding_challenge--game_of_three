import { getDefaultMiddleware } from '@reduxjs/toolkit'

import { matchMiddleware } from '../features/match'
import { playerMiddleware } from '../features/player'

import { traceMiddleware } from '../features/trace'

import type { RootState } from './root-reducer'

//#region ROOT MIDDLEWARE
export const rootMiddleware = getDefaultMiddleware<RootState>().concat(
  traceMiddleware,
  playerMiddleware,
  matchMiddleware
)

export type RootMiddleware = typeof rootMiddleware
//#endregion
