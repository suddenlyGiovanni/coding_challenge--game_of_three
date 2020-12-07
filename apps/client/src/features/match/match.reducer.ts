import { createReducer } from '@reduxjs/toolkit'

import { matchNewState } from './match.actions'

import { IMatchEntity } from '@game-of-three/contracts'

type State = IMatchEntity<string, string, string>[]

const initialState: State = []

export const matchReducer = createReducer(initialState, (builder) => {
  builder.addCase(matchNewState, (state, action) => {
    const matchState = action.payload
    //@ts-expect-error unclear reason FIXME: investigate
    state.push(matchState)
  })
})
