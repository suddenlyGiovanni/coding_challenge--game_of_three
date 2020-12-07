import type { Epic } from 'redux-observable'
import type { ActionType, StateType } from 'typesafe-actions'

declare module '@MyTypes' {
  export type Store = StateType<typeof import('./index').default>
  export type RootState = StateType<typeof import('./root-reducer').default>
  export type RootAction = ActionType<typeof import('./root-action').default>
  export type AppDispatch = typeof import('./index').default.dispatch

  export type RootEpic = Epic<RootAction, RootAction, RootState, Services>

  interface Types {
    RootAction: RootAction
  }
}
