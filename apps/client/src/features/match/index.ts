// eslint-disable-next-line import/no-unresolved
import type { RootState } from '@MyTypes'
import { createAction, createSlice } from '@reduxjs/toolkit'
import type { AnyAction, Selector } from '@reduxjs/toolkit'

import { withPayloadType } from '../utils'

import type { IAction, IMatchEntity } from '@game-of-three/contracts'

//#region MATCH ACTIONS
const matchNewGame = createAction('MATCH/NEW_MATCH')

const matchNewState = createAction(
  'MATCH/NEW_STATE',
  withPayloadType<IMatchEntity<string, string, string>>()
)

const matchMove = createAction('MATCH/MOVE', withPayloadType<IAction>())
//#endregion

//#region MATCH ACTIONS TYPE GUARDS
export const isMatchNewGame = (
  action: AnyAction
): action is ReturnType<typeof matchNewGame> => {
  return action.type === matchNewGame.toString()
}

export const isMatchMove = (
  action: AnyAction
): action is ReturnType<typeof matchMove> => {
  return action.type === matchMove.toString()
}

//#endregion

type MatchState = IMatchEntity<string, string, string>[]

const initialState: MatchState = []

const matchSlice = createSlice({
  extraReducers: (builder) => {
    builder.addCase(matchNewState, (state, action) => [
      ...state,
      action.payload,
    ])
  },
  initialState,
  name: 'match',
  reducers: {},
})

type SelectMatch = Selector<RootState, MatchState>
export const selectMatch: SelectMatch = (state) => state.match
export const actions = {
  matchMove,
  matchNewGame,
  matchNewState,
}
export default matchSlice.reducer
