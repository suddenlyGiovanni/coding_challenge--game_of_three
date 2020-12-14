// eslint-disable-next-line import/no-unresolved
import type { RootState } from '@MyTypes'
import type { Selector } from '@reduxjs/toolkit'
import { createAction, createSlice } from '@reduxjs/toolkit'

import * as systemFeature from '../system'
import { withPayloadType } from '../utils'

import type { PlayerID } from '@game-of-three/contracts'

//#region LOBBY ACTIONS
const addPlayerToLobby = createAction(
  'LOBBY/ADD_PLAYER',
  withPayloadType<PlayerID>()
)

const removePlayerFromLobby = createAction(
  'LOBBY/REMOVE_PLAYER',
  withPayloadType<PlayerID>()
)
//#endregion

export type LobbyState = PlayerID[]

const initialState: LobbyState = []

const lobbySlice = createSlice({
  extraReducers: (builder) =>
    builder
      .addCase(systemFeature.actions.initialize, (state, action) => {
        state = [...action.payload.lobby]
      })
      .addCase(addPlayerToLobby, (state, action) => {
        state.push(action.payload)
      })
      .addCase(removePlayerFromLobby, (state, action) => {
        state.filter((playerID) => playerID !== action.payload)
      }),
  initialState: initialState,
  name: 'lobby',
  reducers: {},
})

export const actions = {
  addPlayerToLobby,
  removePlayerFromLobby,
}

type SelectLobby = Selector<RootState, LobbyState>
export const selectLobby: SelectLobby = (state) => state.lobby

export default lobbySlice.reducer
