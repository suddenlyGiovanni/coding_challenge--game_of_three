type StartStatus = 0
type PlayingStatus = 1
type StopStatus = 2

export type IMatchStatus = StartStatus | PlayingStatus | StopStatus

export enum MatchStatus {
  Start = 0,
  Playing = 1,
  Stop = 2,
}

export interface IMatchStateStart<
  Player1ID extends string = string,
  Player2ID extends string = string
> {
  inputNumber: number
  status: MatchStatus.Start
  turn: Player1ID | Player2ID
  turnNumber: number
}

export interface IMatchStatePlaying<
  Player1ID extends string = string,
  Player2ID extends string = string
> {
  action: -1 | 0 | 1
  inputNumber: number
  outputNumber: number
  status: MatchStatus.Playing
  turn: Player1ID | Player2ID
  turnNumber: number
}

export interface IMatchStateStop<
  Player1ID extends string = string,
  Player2ID extends string = string
> {
  action: -1 | 0 | 1
  inputNumber: number
  outputNumber: number
  status: MatchStatus.Stop
  turn: Player1ID | Player2ID
  turnNumber: number
  winningPlayer: Player1ID | Player2ID
}

export type IMatchState<
  Player1ID extends string = string,
  Player2ID extends string = string
> =
  | IMatchStateStart<Player1ID, Player2ID>
  | IMatchStatePlaying<Player1ID, Player2ID>
  | IMatchStateStop<Player1ID, Player2ID>

export function isMatchStateStart(
  matchState: IMatchState
): matchState is IMatchStateStart {
  return matchState.status === MatchStatus.Start
}

export function isMatchStatePlaying(
  matchState: IMatchState
): matchState is IMatchStatePlaying {
  return matchState.status === MatchStatus.Playing
}

export function isMatchStateStop(
  matchState: IMatchState
): matchState is IMatchStatePlaying {
  return matchState.status === MatchStatus.Stop
}
