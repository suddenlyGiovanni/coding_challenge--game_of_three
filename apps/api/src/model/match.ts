import { v4 as uuid } from 'uuid'

import {
  IMatch,
  IMatchState,
  IObserver,
  IPlayer,
  ISubject,
  ITurn,
} from '../interfaces'
import { MatchState } from '../model/match-state'

import { Turn } from './turn'

import { IMatchEntity, MatchStatus } from '@game-of-three/contracts'

export interface IUUIDStrategy {
  <T extends string = string>(): T
}
export type INumberGeneratorStrategy = () => number
export class Match<
  PlayerID1 extends string = string,
  PlayerID2 extends string = string,
  MatchID extends string = string
> implements IMatch<PlayerID1, PlayerID2, MatchID>, ISubject<IMatchEntity> {
  public static readonly MAX = 100

  public static readonly MIN = 3

  public readonly __type: 'Match' = 'Match'

  private readonly _id: MatchID

  private _initialized: boolean

  private readonly _matchStateHistory: IMatchState<
    MatchID,
    PlayerID1,
    PlayerID2
  >[]

  private readonly _numberGeneratorStrategy: INumberGeneratorStrategy

  private readonly _observers: IObserver<IMatchEntity>[]

  private readonly _players: readonly [
    player1: IPlayer<PlayerID1>,
    player2: IPlayer<PlayerID2>
  ]

  private readonly _turn: ITurn<MatchID, PlayerID1, PlayerID2>

  public constructor(
    player1: IPlayer<PlayerID1>,
    player2: IPlayer<PlayerID2>,
    numberGeneratorStrategy?: INumberGeneratorStrategy,
    uuidStrategy: IUUIDStrategy = uuid
  ) {
    this._id = uuidStrategy<MatchID>()
    this._initialized = false
    this._players = [player1, player2] as const
    this._turn = new Turn(player1, player2, this._id)
    this._matchStateHistory = []
    this._observers = []

    if (numberGeneratorStrategy) {
      this._numberGeneratorStrategy = numberGeneratorStrategy
    } else {
      this._numberGeneratorStrategy = () =>
        Match.defaultNumberGeneratorStrategy(Match.MIN, Match.MAX)
    }
  }

  public static defaultNumberGeneratorStrategy(
    min: number,
    max: number
  ): number {
    const _min = Math.ceil(min)
    const _max = Math.floor(max)
    //The maximum is inclusive and the minimum is inclusive
    return Math.floor(Math.random() * (_max - _min + 1) + _min)
  }

  public get turn(): IPlayer<PlayerID1> | IPlayer<PlayerID2> {
    this._assertInitialized()
    return this._turn.current
  }

  public get turnNumber(): number {
    this._assertInitialized()
    return this._turn.number
  }

  public get id(): MatchID {
    return this._id
  }

  public get state(): Readonly<IMatchState<MatchID, PlayerID1, PlayerID2>> {
    this._assertInitialized()
    const { length } = this._matchStateHistory

    if (length === 0) {
      throw new Error('Empty matchStateHistory.')
    }
    return this._matchStateHistory[length - 1]
  }

  public get stateHistory(): ReadonlyArray<
    Readonly<IMatchState<MatchID, PlayerID1, PlayerID2>>
  > {
    this._assertInitialized()
    return this._matchStateHistory
  }

  public get status():
    | MatchStatus.Start
    | MatchStatus.Playing
    | MatchStatus.Stop {
    this._assertInitialized()
    return this.state.status
  }

  public get players(): readonly [
    player1: IPlayer<PlayerID1>,
    player2: IPlayer<PlayerID2>
  ] {
    return this._players
  }

  public init(): void {
    if (this._initialized) {
      throw new Error(
        "Match already initialized. Can't re-initialize the Match"
      )
    } else {
      this._turn.init()
      const initialMatchState = new MatchState<MatchID, PlayerID1, PlayerID2>({
        id: this.id,
        nextTurn: this._turn.current,
        outputNumber: this._numberGeneratorStrategy(),
        players: this._players,
        status: MatchStatus.Start,
        turnNumber: 0,
      })
      this._matchStateHistory.push(initialMatchState)
      this._initialized = true
      this.notifyObservers()
    }
  }

  public notifyObservers(): void {
    this._observers.forEach((observer) => {
      observer.update(this.state.serialize())
    })
  }

  public get nextTurn(): IPlayer<PlayerID1> | IPlayer<PlayerID2> {
    this._assertInitialized()
    return this._turn.next
  }

  public push(matchState: IMatchState<MatchID, PlayerID1, PlayerID2>): void {
    this._assertInitialized()
    this._matchStateHistory.push(matchState)

    if (matchState.isPlaying()) {
      this._turn.switch()
    }
    this.notifyObservers()
  }

  public registerObserver(observer: IObserver<IMatchEntity>): void {
    this._observers.push(observer)
  }

  public removeObserver(observer: IObserver<IMatchEntity>): void {
    const index = this._observers.indexOf(observer)
    if (index !== -1) {
      this._observers.splice(index, 1)
    }
  }

  private _assertInitialized(): void {
    if (this._initialized === false) {
      throw new Error(
        'Match not initialize. Remember to invoke `init()` after instantiation.'
      )
    }
  }
}
