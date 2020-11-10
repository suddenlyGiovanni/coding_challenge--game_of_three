type PlayingState = 0
type EndState = 1

export enum MatchState {
  Playing = 0,
  End = 1,
}

export interface IMatchState<
  Player1ID extends string,
  Player2ID extends string
> {
  action: -1 | 0 | 1
  inputNumber: number
  matchState: PlayingState | EndState
  outputNumber: number
  turn: Player1ID | Player2ID
  turnNumber: number
  winningPlayer?: Player1ID | Player2ID
}
