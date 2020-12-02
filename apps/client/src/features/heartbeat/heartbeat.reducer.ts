import { createReducer } from '@reduxjs/toolkit'

import { syncHeartbeat } from './heartbeat.action'

export type DateISOString = string

type State = string

const initialState: State = ''

export const heartbeatReducer = createReducer(initialState, (builder) => {
  builder.addCase(syncHeartbeat, (state, action) => action.payload)
})
