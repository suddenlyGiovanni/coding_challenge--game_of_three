// eslint-disable-next-line import/no-unresolved
import type { RootState } from '@MyTypes'
import type { Selector } from '@reduxjs/toolkit'
import { createAction, createSlice } from '@reduxjs/toolkit'

import { withPayloadType } from '../utils'

const toggleConnected = createAction(
  'CONNECTION/TOGGLE',
  withPayloadType<boolean>()
)

type ConnectionState = boolean

const initialState: ConnectionState = false

const connectionSlice = createSlice({
  extraReducers: (builder) => {
    builder.addCase(toggleConnected, (state, action) => action.payload)
  },
  initialState: initialState,
  name: 'connection',
  reducers: {},
})

export const actions = { toggleConnected }

type SelectConnection = Selector<RootState, ConnectionState>
export const selectConnection: SelectConnection = (state) => state.connected

export default connectionSlice.reducer
