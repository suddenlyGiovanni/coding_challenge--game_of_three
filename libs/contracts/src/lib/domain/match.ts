import type { IEntity } from './entity'
import type { IPlayerEntity } from './player'

export enum MatchStatus {
  Start = 'START',
  Playing = 'PLAYING',
  Stop = 'STOP',
}

export type IMatchStatusStart = 'START'
export type IMatchStatusPlaying = 'PLAYING'
export type IMatchStatusStop = 'STOP'

export type IMatchStatus =
  | IMatchStatusStart
  | IMatchStatusPlaying
  | IMatchStatusStop

export type IAction = -1 | 0 | 1

export function isAction(action: unknown): action is IAction {
  return (
    typeof action === 'number' &&
    (action === -1 || action === 0 || action === 1)
  )
}

export function assertIsAction(action: unknown): asserts action is IAction {
  if (!isAction(action))
    throw new Error(
      `does not extends type IAction = -1 | 0 | 1.\naction: ${String(action)}`
    )
}

export interface IMatchEntityStart<
  MatchID extends string = string,
  PlayerID1 extends string = string,
  PlayerID2 extends string = string
> extends IEntity<MatchID, 'MatchState'> {
  readonly nextTurn: IPlayerEntity
  readonly outputNumber: number
  readonly players: readonly [
    player1: IPlayerEntity<PlayerID1>,
    player2: IPlayerEntity<PlayerID2>
  ]
  readonly status: MatchStatus.Start
  readonly turnNumber: 0
}

export interface IMatchEntityPlaying<
  MatchID extends string = string,
  PlayerID1 extends string = string,
  PlayerID2 extends string = string
> extends IEntity<MatchID, 'MatchState'> {
  readonly action: IAction
  readonly currentTurn: IPlayerEntity
  readonly inputNumber: number
  readonly nextTurn: IPlayerEntity
  readonly outputNumber: number
  readonly players: readonly [
    player1: IPlayerEntity<PlayerID1>,
    player2: IPlayerEntity<PlayerID2>
  ]
  readonly status: MatchStatus.Playing
  readonly turnNumber: number
}

export interface IMatchEntityStop<
  MatchID extends string = string,
  PlayerID1 extends string = string,
  PlayerID2 extends string = string
> extends IEntity<MatchID, 'MatchState'> {
  readonly action: IAction
  readonly currentTurn: IPlayerEntity
  readonly inputNumber: number
  readonly outputNumber: number
  readonly players: readonly [
    player1: IPlayerEntity<PlayerID1>,
    player2: IPlayerEntity<PlayerID2>
  ]
  readonly status: MatchStatus.Stop
  readonly turnNumber: number
  readonly winningPlayer: IPlayerEntity
}

export type IMatchEntity<
  MatchID extends string = string,
  PlayerID1 extends string = string,
  PlayerID2 extends string = string
> =
  | IMatchEntityStart<MatchID, PlayerID1, PlayerID2>
  | IMatchEntityPlaying<MatchID, PlayerID1, PlayerID2>
  | IMatchEntityStop<MatchID, PlayerID1, PlayerID2>
