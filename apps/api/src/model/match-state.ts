/* eslint-disable @typescript-eslint/ban-types */
import type { IMatchState, IPlayer } from '../interfaces'

import {
  IAction,
  IMatchEntity,
  IMatchEntityPlaying,
  IMatchEntityStart,
  IMatchEntityStop,
  MatchStatus,
} from '@game-of-three/contracts'

export class MatchState<
  MatchID extends string = string,
  PlayerID1 extends string = string,
  PlayerID2 extends string = string
> implements IMatchState {
  public readonly __type: 'MatchState' = 'MatchState'

  public readonly action?: IAction

  public readonly currentTurn?: IPlayer<PlayerID1> | IPlayer<PlayerID2>

  public readonly id: MatchID

  public readonly inputNumber?: number

  public readonly nextTurn?: IPlayer<PlayerID1> | IPlayer<PlayerID2>

  public readonly outputNumber!: number

  public readonly players: readonly [
    player1: IPlayer<PlayerID1>,
    player2: IPlayer<PlayerID2>
  ]

  public readonly status:
    | MatchStatus.Start
    | MatchStatus.Playing
    | MatchStatus.Stop

  public readonly turnNumber!: number

  public readonly winningPlayer?: IPlayer<PlayerID1> | IPlayer<PlayerID2>

  public constructor(state: {
    id: MatchID
    nextTurn: IPlayer<PlayerID1> | IPlayer<PlayerID2>
    outputNumber: number
    players: readonly [player1: IPlayer<PlayerID1>, player2: IPlayer<PlayerID2>]
    status: MatchStatus.Start
    turnNumber: 0
  })

  public constructor(state: {
    action: IAction
    currentTurn: IPlayer<PlayerID1> | IPlayer<PlayerID2>
    id: MatchID
    inputNumber: number
    nextTurn: IPlayer<PlayerID1> | IPlayer<PlayerID2>
    outputNumber: number
    players: readonly [player1: IPlayer<PlayerID1>, player2: IPlayer<PlayerID2>]
    status: MatchStatus.Playing
    turnNumber: number
  })

  public constructor(state: {
    action: IAction
    currentTurn: IPlayer<PlayerID1> | IPlayer<PlayerID2>
    id: MatchID
    inputNumber: number
    outputNumber: number
    players: readonly [player1: IPlayer<PlayerID1>, player2: IPlayer<PlayerID2>]
    status: MatchStatus.Stop
    turnNumber: number
    winningPlayer: IPlayer<PlayerID1> | IPlayer<PlayerID2>
  })

  public constructor(state: {
    action?: IAction
    currentTurn?: IPlayer<PlayerID1> | IPlayer<PlayerID2>
    id: MatchID
    inputNumber?: number
    nextTurn?: IPlayer<PlayerID1> | IPlayer<PlayerID2>
    outputNumber: number
    players: readonly [player1: IPlayer<PlayerID1>, player2: IPlayer<PlayerID2>]
    status: MatchStatus.Start | MatchStatus.Playing | MatchStatus.Stop
    turnNumber: 0 | number
    winningPlayer?: IPlayer<PlayerID1> | IPlayer<PlayerID2>
  }) {
    this.id = state.id
    this.players = state.players

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
    state: Readonly<IMatchEntity>
  ): state is IMatchEntityPlaying {
    return state.status === MatchStatus.Playing
  }

  public static isIMatchStateStartSerialized(
    state: Readonly<IMatchEntity>
  ): state is IMatchEntityStart {
    return state.status === MatchStatus.Start
  }

  public static isIMatchStateStopSerialized(
    state: Readonly<IMatchEntity>
  ): state is IMatchEntityStop {
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

  public serialize(): Readonly<IMatchEntity<MatchID, PlayerID1, PlayerID2>> {
    const matchStateSerialized = ({
      __type: 'MatchState',
      id: this.id,
      ...(typeof this.action === 'number' && { action: this.action }),
      ...(this.currentTurn && { currentTurn: this.currentTurn.serialize() }),
      ...(typeof this.inputNumber === 'number' && {
        inputNumber: this.inputNumber,
      }),
      ...(this.nextTurn && { nextTurn: this.nextTurn.serialize() }),
      outputNumber: this.outputNumber,
      players: this.players.map((p) => p.serialize()),
      status: this.status,
      turnNumber: this.turnNumber,
      ...(this.winningPlayer && {
        winningPlayer: this.winningPlayer.serialize(),
      }),
    } as unknown) as Readonly<IMatchEntity<MatchID, PlayerID1, PlayerID2>>
    return matchStateSerialized
  }
}
