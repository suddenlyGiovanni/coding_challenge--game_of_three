import { createReducer } from '@reduxjs/toolkit'

import { toggleConnected } from './connection.actions'

type State = boolean

const initialState: State = false

export const connectionReducer = createReducer(initialState, (builder) => {
  builder.addCase(toggleConnected, (_, action) => action.payload)
})
