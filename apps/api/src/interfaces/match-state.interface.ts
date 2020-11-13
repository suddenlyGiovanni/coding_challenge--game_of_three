import { MatchStatus } from '../model/match-state'

import { IPlayer } from './player.interface'

type StartStatus = 0
type PlayingStatus = 1
type StopStatus = 2

export type IMatchStatus = StartStatus | PlayingStatus | StopStatus

export type IAction = -1 | 0 | 1

export interface IMatchState {
  readonly action?: IAction

  readonly currentTurn?: IPlayer

  readonly inputNumber?: number

  readonly nextTurn?: IPlayer

  readonly outputNumber: number

  readonly status: IMatchStatus

  readonly turnNumber: number

  readonly winningPlayer?: IPlayer

  isPlaying(): boolean

  isStarting(): boolean

  isStopped(): boolean

  serialize(): Readonly<IMatchStateSerialized>
}

export interface IMatchStateStartSerialized<PlayerID extends string = string> {
  readonly nextTurn: PlayerID
  readonly outputNumber: number
  readonly status: MatchStatus.Start
  readonly turnNumber: 0
}

export interface IMatchStatePlayingSerialized<
  PlayerID extends string = string
> {
  readonly action: IAction
  readonly currentTurn: PlayerID
  readonly inputNumber: number
  readonly nextTurn: PlayerID
  readonly outputNumber: number
  readonly status: MatchStatus.Playing
  readonly turnNumber: number
}

export interface IMatchStateStopSerialized<PlayerID extends string = string> {
  readonly action: IAction
  readonly currentTurn: PlayerID
  readonly inputNumber: number
  readonly outputNumber: number
  readonly status: MatchStatus.Stop
  readonly turnNumber: number
  readonly winningPlayer: PlayerID
}

export type IMatchStateSerialized<PlayerID extends string = string> =
  | IMatchStateStartSerialized<PlayerID>
  | IMatchStatePlayingSerialized<PlayerID>
  | IMatchStateStopSerialized<PlayerID>
