import { IPlayer } from './player.interface'

import {
  IAction,
  IEntity,
  IMatchStateSerialized,
  MatchStatus,
} from '@game-of-three/contracts'

export interface IMatchState<
  MatchID extends string = string,
  PlayerID1 extends string = string,
  PlayerID2 extends string = string
> extends IEntity<MatchID, 'MatchState'> {
  readonly action?: IAction

  readonly currentTurn?: IPlayer<PlayerID1> | IPlayer<PlayerID2>

  readonly inputNumber?: number

  readonly nextTurn?: IPlayer<PlayerID1> | IPlayer<PlayerID2>

  readonly outputNumber: number
  readonly players: readonly [
    player1: IPlayer<PlayerID1>,
    player2: IPlayer<PlayerID2>
  ]

  readonly status: MatchStatus.Start | MatchStatus.Playing | MatchStatus.Stop

  readonly turnNumber: number

  readonly winningPlayer?: IPlayer<PlayerID1> | IPlayer<PlayerID2>

  isPlaying(): boolean

  isStarting(): boolean

  isStopped(): boolean

  serialize(): Readonly<IMatchStateSerialized<MatchID, PlayerID1, PlayerID2>>
}
