import { combineReducers } from '@reduxjs/toolkit'

import connectionReducer from '../features/connection'
import lobbyReducer from '../features/lobby'
import matchReducer from '../features/match'
import systemReducer from '../features/system'

const rootReducer = combineReducers({
  connected: connectionReducer,
  lobby: lobbyReducer,
  match: matchReducer,
  system: systemReducer,
})

export default rootReducer
