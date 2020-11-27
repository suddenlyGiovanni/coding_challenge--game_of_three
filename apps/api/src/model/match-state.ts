/* eslint-disable @typescript-eslint/ban-types */
import type { IMatchState, IPlayer } from '../interfaces'

import {
  IAction,
  IMatchStatePlayingSerialized,
  IMatchStateSerialized,
  IMatchStateStartSerialized,
  IMatchStateStopSerialized,
  IMatchStatus,
  IMatchStatusPlaying,
  IMatchStatusStart,
  IMatchStatusStop,
  MatchStatus,
} from '@game-of-three/contracts'

export class MatchState<MatchID extends string = string>
  implements IMatchState {
  public readonly __type: 'MatchState' = 'MatchState'

  public readonly action?: IAction

  public readonly currentTurn?: IPlayer

  public readonly id: MatchID

  public readonly inputNumber?: number

  public readonly nextTurn?: IPlayer

  public readonly outputNumber!: number

  public readonly status!: IMatchStatus

  public readonly turnNumber!: number

  public readonly winningPlayer?: IPlayer

  public constructor(state: {
    id: MatchID
    nextTurn: IPlayer
    outputNumber: number
    status: IMatchStatusStart
    turnNumber: 0
  })

  public constructor(state: {
    action: IAction
    currentTurn: IPlayer
    id: MatchID
    inputNumber: number
    nextTurn: IPlayer
    outputNumber: number
    status: IMatchStatusPlaying
    turnNumber: number
  })

  public constructor(state: {
    action: IAction
    currentTurn: IPlayer
    id: MatchID
    inputNumber: number
    outputNumber: number
    status: IMatchStatusStop
    turnNumber: number
    winningPlayer: IPlayer
  })

  public constructor(state: {
    action?: IAction
    currentTurn?: IPlayer
    id: MatchID
    inputNumber?: number
    nextTurn?: IPlayer
    outputNumber: number
    status: IMatchStatusStart | IMatchStatusPlaying | IMatchStatusStop
    turnNumber: 0 | number
    winningPlayer?: IPlayer
  }) {
    this.id = state.id

    if (state.status === MatchStatus.Start) {
      this.outputNumber = state.outputNumber
      this.status = state.status
      this.turnNumber = state.turnNumber
      this.nextTurn = state.nextTurn
    }

    if (state.status === MatchStatus.Stop) {
      this.action = state.action
      this.currentTurn = state.currentTurn
      this.inputNumber = state.inputNumber
      this.outputNumber = state.outputNumber
      this.status = state.status
      this.turnNumber = state.turnNumber
      this.winningPlayer = state.winningPlayer
    }

    if (state.status === MatchStatus.Playing) {
      this.action = state.action
      this.inputNumber = state.inputNumber
      this.outputNumber = state.outputNumber
      this.status = state.status
      this.turnNumber = state.turnNumber
      this.currentTurn = state.currentTurn
      this.nextTurn = state.nextTurn
    }
  }

  public static isIMatchStatePlayingSerialized(
    state: Readonly<IMatchStateSerialized>
  ): state is IMatchStatePlayingSerialized {
    return state.status === MatchStatus.Playing
  }

  public static isIMatchStateStartSerialized(
    state: Readonly<IMatchStateSerialized>
  ): state is IMatchStateStartSerialized {
    return state.status === MatchStatus.Start
  }

  public static isIMatchStateStopSerialized(
    state: Readonly<IMatchStateSerialized>
  ): state is IMatchStateStopSerialized {
    return state.status === MatchStatus.Stop
  }

  public isPlaying(): boolean {
    return this.status === MatchStatus.Playing
  }

  public isStarting(): boolean {
    return this.status === MatchStatus.Start
  }

  public isStopped(): boolean {
    return this.status === MatchStatus.Stop
  }

  public serialize(): Readonly<IMatchStateSerialized> {
    const matchStateSerialized: IMatchStateSerialized = {
      __type: 'MatchState',
      id: this.id,
      ...(typeof this.action === 'number' && { action: this.action }),
      ...(this.currentTurn && { currentTurn: this.currentTurn.serialize() }),
      ...(typeof this.inputNumber === 'number' && {
        inputNumber: this.inputNumber,
      }),
      ...(this.nextTurn && { nextTurn: this.nextTurn.serialize() }),
      outputNumber: this.outputNumber,
      status: this.status,
      turnNumber: this.turnNumber,
      ...(this.winningPlayer && {
        winningPlayer: this.winningPlayer.serialize(),
      }),
    } as IMatchStateSerialized
    return matchStateSerialized
  }
}
