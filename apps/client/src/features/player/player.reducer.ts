import { createReducer } from '@reduxjs/toolkit'

import { initialize } from '../initialize/initialize.action'

import { playerUpdate } from './player.actions'

import { PlayerID } from '@game-of-three/contracts'

type State = '' | PlayerID

const initialState: State = ''

export const playerReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(initialize, (_, action) => {
      return action.payload.player.id
    })
    .addCase(playerUpdate, (_, action) => {
      return action.payload.id
    })
})
