/* eslint-disable @typescript-eslint/ban-types */
import type { IMatchState, IPlayer } from '../interfaces'

import {
  IAction,
  IMatchStatePlayingSerialized,
  IMatchStateSerialized,
  IMatchStateStartSerialized,
  IMatchStateStopSerialized,
  IMatchStatus,
  MatchStatus,
} from '@game-of-three/api-interfaces'

export class MatchState implements IMatchState {
  readonly action?: IAction

  readonly currentTurn?: IPlayer

  readonly inputNumber?: number

  readonly nextTurn?: IPlayer

  readonly outputNumber: number

  readonly status: IMatchStatus

  readonly turnNumber: number

  readonly winningPlayer?: IPlayer

  public constructor(state: {
    nextTurn: IPlayer
    outputNumber: number
    status: MatchStatus.Start
    turnNumber: 0
  })

  public constructor(state: {
    action: IAction
    currentTurn: IPlayer
    inputNumber: number
    nextTurn: IPlayer
    outputNumber: number
    status: MatchStatus.Playing
    turnNumber: number
  })

  public constructor(state: {
    action: IAction
    currentTurn: IPlayer
    inputNumber: number
    outputNumber: number
    status: MatchStatus.Stop
    turnNumber: number
    winningPlayer: IPlayer
  })

  public constructor(state: {
    action?: IAction
    currentTurn?: IPlayer
    inputNumber?: number
    nextTurn?: IPlayer
    outputNumber: number
    status: MatchStatus.Start | MatchStatus.Playing | MatchStatus.Stop
    turnNumber: 0 | number
    winningPlayer?: IPlayer
  }) {
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
    const t: IMatchStateSerialized = {
      action: this.action,
      currentTurn: this.currentTurn?.getId(),
      inputNumber: this.inputNumber,
      nextTurn: this.nextTurn?.getId(),
      outputNumber: this.outputNumber,
      status: this.status,
      turnNumber: this.turnNumber,
      winningPlayer: this.winningPlayer?.getId(),
    }
    return t
  }
}
