import type { IEntity } from './entity'
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

export interface IMatchStateStartSerialized<
  MatchID extends string = string,
  PlayerID1 extends string = string,
  PlayerID2 extends string = string
> extends IEntity<MatchID, 'MatchState'> {
  readonly nextTurn: PlayerSerialized
  readonly outputNumber: number
  readonly players: readonly [
    player1: PlayerSerialized<PlayerID1>,
    player2: PlayerSerialized<PlayerID2>
  ]
  readonly status: MatchStatus.Start
  readonly turnNumber: 0
}

export interface IMatchStatePlayingSerialized<
  MatchID extends string = string,
  PlayerID1 extends string = string,
  PlayerID2 extends string = string
> extends IEntity<MatchID, 'MatchState'> {
  readonly action: IAction
  readonly currentTurn: PlayerSerialized
  readonly inputNumber: number
  readonly nextTurn: PlayerSerialized
  readonly outputNumber: number
  readonly players: readonly [
    player1: PlayerSerialized<PlayerID1>,
    player2: PlayerSerialized<PlayerID2>
  ]
  readonly status: MatchStatus.Playing
  readonly turnNumber: number
}

export interface IMatchStateStopSerialized<
  MatchID extends string = string,
  PlayerID1 extends string = string,
  PlayerID2 extends string = string
> extends IEntity<MatchID, 'MatchState'> {
  readonly action: IAction
  readonly currentTurn: PlayerSerialized
  readonly inputNumber: number
  readonly outputNumber: number
  readonly players: readonly [
    player1: PlayerSerialized<PlayerID1>,
    player2: PlayerSerialized<PlayerID2>
  ]
  readonly status: MatchStatus.Stop
  readonly turnNumber: number
  readonly winningPlayer: PlayerSerialized
}

export type IMatchStateSerialized<
  MatchID extends string = string,
  PlayerID1 extends string = string,
  PlayerID2 extends string = string
> =
  | IMatchStateStartSerialized<MatchID, PlayerID1, PlayerID2>
  | IMatchStatePlayingSerialized<MatchID, PlayerID1, PlayerID2>
  | IMatchStateStopSerialized<MatchID, PlayerID1, PlayerID2>
