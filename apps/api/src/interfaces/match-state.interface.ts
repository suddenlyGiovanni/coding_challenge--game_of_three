import { IPlayer } from './player.interface'

import {
  IAction,
  IMatchStateSerialized,
  IMatchStatus,
} from '@game-of-three/api-interfaces'

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
