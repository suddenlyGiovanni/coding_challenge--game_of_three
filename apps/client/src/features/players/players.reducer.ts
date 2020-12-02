import { createReducer } from '@reduxjs/toolkit'

import { initialize } from '../initialize/initialize.action'

import {
  playersAddOne,
  playersRemoveOne,
  playersUpdateOne,
} from './players.actions'

import { PlayerSerialized } from '@game-of-three/contracts'

type State = ReadonlyArray<PlayerSerialized>

const initialState: State = []

export const playersReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(initialize, (state, action) => {
      state.push(...action.payload.players)
    })
    .addCase(playersAddOne, (state, action) => {
      state.push(action.payload)
    })
    .addCase(playersUpdateOne, (state, action) => {
      const index = state.indexOf(
        state.find((player) => player.id === action.payload.id)
      )
      if (index > -1) {
        state[index] = action.payload
      }
    })
    .addCase(playersRemoveOne, (state, action) =>
      state.filter((player) => player.id !== action.payload.id)
    )
})
