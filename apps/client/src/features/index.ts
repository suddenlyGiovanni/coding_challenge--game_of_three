import { createAction, createReducer } from '@reduxjs/toolkit'

import {
  IMatchStateSerialized,
  PlayerID,
  PlayerSerialized,
  ServerState,
} from '@game-of-three/contracts'

type DateISOString = string
interface State {
  readonly connected: boolean
  readonly heartbeat: DateISOString
  readonly lobby: ReadonlyArray<PlayerID>
  matchState: IMatchStateSerialized<string, string, string>[]
  readonly players: ReadonlyArray<PlayerSerialized>
}

interface WithPayloadType {
  <T>(): (t: T) => { payload: T }
}
const withPayloadType: WithPayloadType = () => (t) => ({ payload: t })

const initialState: State = {
  connected: false,
  heartbeat: '',
  lobby: [],
  matchState: [],
  players: [],
}

export const syncHeartbeat = createAction(
  'HEARTBEAT/SYNC',
  withPayloadType<DateISOString>()
)
export const toggleConnected = createAction(
  'CONNECTED/TOGGLE',
  withPayloadType<boolean>()
)
export const initializePlayers = createAction(
  'STATE/INITIALIZE',
  withPayloadType<ServerState>()
)
export const addPlayer = createAction(
  'PLAYERS/ADD_PLAYER',
  withPayloadType<PlayerSerialized>()
)
export const removePlayer = createAction(
  'PLAYERS/REMOVE_PLAYER',
  withPayloadType<PlayerSerialized>()
)
export const updatePlayer = createAction(
  'PLAYERS/UPDATE_PLAYER',
  withPayloadType<PlayerSerialized>()
)
export const addPlayerToLobby = createAction(
  'LOBBY/ADD_PLAYER',
  withPayloadType<PlayerID>()
)
export const removePlayerFromLobby = createAction(
  'LOBBY/REMOVE_PLAYER',
  withPayloadType<PlayerID>()
)
export const updateMatchState = createAction(
  'MATCH/NEW_STATE',
  withPayloadType<IMatchStateSerialized<string, string, string>>()
)

export const reducer = createReducer(initialState, (builder) => {
  builder
    .addCase(syncHeartbeat, (state, action) => {
      state.heartbeat = action.payload
    })
    .addCase(toggleConnected, (state, action) => {
      state.connected = action.payload
    })
    .addCase(initializePlayers, (state, action) => {
      state.players.push(...action.payload.players)
      state.lobby.push(...action.payload.lobby)
    })
    .addCase(addPlayer, (state, action) => {
      state.players.push(action.payload)
    })
    .addCase(updatePlayer, (state, action) => {
      const player = state.players.find(
        (player) => player.id === action.payload.id
      )
      const index = state.players.indexOf(player)
      if (index > 0) {
        state.players[index] = action.payload
      }
    })
    .addCase(removePlayer, (state, action) => {
      state.players.filter((player) => player.id !== action.payload.id)
    })
    .addCase(addPlayerToLobby, (state, action) => {
      state.lobby.push(action.payload)
    })
    .addCase(removePlayerFromLobby, (state, action) => {
      state.lobby.filter((playerID) => playerID !== action.payload)
    })
    .addCase(updateMatchState, (state, action) => {
      const matchState = action.payload
      // @ts-expect-error donnow
      state.matchState.push(matchState)
    })
})
