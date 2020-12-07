// eslint-disable-next-line import/no-unresolved
import type { RootState } from '@MyTypes'
import { createAction, createSelector, createSlice } from '@reduxjs/toolkit'
import type { AnyAction, Selector } from '@reduxjs/toolkit'

import { withPayloadType } from '../utils'

import type {
  IPlayerEntity,
  ISODataString,
  IServerState,
  PlayerID,
} from '@game-of-three/contracts'

//#region SYSTEM ACTIONS
const heartbeat = createAction(
  'SYSTEM/HEARTBEAT',
  withPayloadType<ISODataString>()
)

const initialize = createAction(
  'SYSTEM/INITIALIZE',
  withPayloadType<IServerState>()
)

const playerAdded = createAction(
  'SYSTEM/PLAYER_ADDED',
  withPayloadType<IPlayerEntity>()
)

const playerRemoved = createAction(
  'SYSTEM/PLAYER_REMOVED',
  withPayloadType<IPlayerEntity>()
)

const playerUpdated = createAction(
  'SYSTEM/PLAYER_UPDATED',
  withPayloadType<IPlayerEntity>()
)

const userNameUpdated = createAction(
  'SYSTEM/USER_NAME_UPDATED',
  withPayloadType<string>()
)

const userUpdated = createAction(
  'SYSTEM/USER_UPDATED',
  withPayloadType<IPlayerEntity>()
)
//#endregion

//#region SYSTEM ACTIONS GUARDS
export const isUserNameUpdated = (
  action: AnyAction
): action is ReturnType<typeof userNameUpdated> => userNameUpdated.match(action)
//#endregion

export type DateISOString = string

export interface SystemState {
  heartbeat: null | string
  players: ReadonlyArray<IPlayerEntity>
  user: PlayerID
}

const initialState: SystemState = {
  heartbeat: null,
  players: [],
  user: '',
}

const systemSlice = createSlice({
  extraReducers: (builder) => {
    builder
      .addCase(heartbeat, (state, action) => {
        state.heartbeat = action.payload
      })
      .addCase(initialize, (state, action) => {
        state.players.push(...action.payload.players)
        state.user = action.payload.player.id
      })
      .addCase(playerAdded, (state, action) => {
        state.players.push(action.payload)
      })
      .addCase(playerUpdated, (state, action) => {
        const index = state.players.indexOf(
          state.players.find((player) => player.id === action.payload.id)
        )
        if (index > -1) {
          state.players[index] = action.payload
        }
      })
      .addCase(playerRemoved, (state, action) => {
        state.players = state.players.filter(
          (player) => player.id !== action.payload.id
        )
      })
      .addCase(userUpdated, (state, action) => {
        state.user = action.payload.id
        // todo update user name in players field
      })
  },
  initialState,
  name: 'system',
  reducers: {},
})

export const actions = {
  heartbeat,
  initialize,
  playerAdded,
  playerRemoved,
  playerUpdated,
  userNameUpdated,
  userUpdated,
}

export const selectSystem: Selector<RootState, SystemState> = (state) =>
  state.system

const heartbeatLens: Selector<SystemState, SystemState['heartbeat']> = (
  systemState
) => systemState.heartbeat

const playersLens: Selector<SystemState, SystemState['players']> = (
  systemState
) => systemState.players

const userLens: Selector<SystemState, SystemState['user']> = (systemState) =>
  systemState.user

export const selectHeartbeat = createSelector(selectSystem, heartbeatLens)
export const selectPlayers = createSelector(selectSystem, playersLens)
export const selectUserID = createSelector(selectSystem, userLens)

export const selectUser = createSelector(
  [selectPlayers, selectUserID],
  (players, userID) => players.find((player) => player.id === userID)
)

export default systemSlice.reducer
