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
  turn: Player1ID | Player2ID
  turnNumber: number
  inputNumber: number
  action: -1 | 0 | 1
  outputNumber: number
  matchState: PlayingState | EndState
  winningPlayer?: Player1ID | Player2ID
}
