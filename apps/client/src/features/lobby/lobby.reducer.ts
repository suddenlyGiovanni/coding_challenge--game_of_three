import { createReducer } from '@reduxjs/toolkit'

import { initialize } from '../initialize/initialize.action'

import { addPlayerToLobby, removePlayerFromLobby } from './lobby.actions'

import { PlayerID } from '@game-of-three/contracts'

type State = PlayerID[]

const initialState: State = []

export const lobbyReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(initialize, (state, action) => {
      state = [...action.payload.lobby]
    })
    .addCase(addPlayerToLobby, (state, action) => {
      state.push(action.payload)
    })
    .addCase(removePlayerFromLobby, (state, action) => {
      state.filter((playerID) => playerID !== action.payload)
    })
})
