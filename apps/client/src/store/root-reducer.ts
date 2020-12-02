import { combineReducers } from '@reduxjs/toolkit'

import { connectionReducer } from '../features/connection'
import { heartbeatReducer } from '../features/heartbeat'
import { lobbyReducer } from '../features/lobby'
import { matchReducer } from '../features/match'
import { playerReducer } from '../features/player'
import { playersReducer } from '../features/players'

//#region ROOT REDUCER
export const rootReducer = combineReducers({
  connected: connectionReducer,
  heartbeat: heartbeatReducer,
  lobby: lobbyReducer,
  match: matchReducer,
  player: playerReducer,
  players: playersReducer,
})
export type RootState = ReturnType<typeof rootReducer>
//#endregion
