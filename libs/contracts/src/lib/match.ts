import type { PlayerSerialized } from './player'

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

export interface IMatchStateStartSerialized<PlayerID extends string = string> {
  readonly nextTurn: PlayerSerialized<PlayerID>
  readonly outputNumber: number
  readonly status: MatchStatus.Start
  readonly turnNumber: 0
}

export interface IMatchStatePlayingSerialized<
  PlayerID extends string = string
> {
  readonly action: IAction
  readonly currentTurn: PlayerSerialized<PlayerID>
  readonly inputNumber: number
  readonly nextTurn: PlayerSerialized<PlayerID>
  readonly outputNumber: number
  readonly status: MatchStatus.Playing
  readonly turnNumber: number
}

export interface IMatchStateStopSerialized<PlayerID extends string = string> {
  readonly action: IAction
  readonly currentTurn: PlayerSerialized<PlayerID>
  readonly inputNumber: number
  readonly outputNumber: number
  readonly status: MatchStatus.Stop
  readonly turnNumber: number
  readonly winningPlayer: PlayerSerialized<PlayerID>
}

export type IMatchStateSerialized<PlayerID extends string = string> =
  | IMatchStateStartSerialized<PlayerID>
  | IMatchStatePlayingSerialized<PlayerID>
  | IMatchStateStopSerialized<PlayerID>
