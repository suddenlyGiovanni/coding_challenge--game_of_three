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

import {
  IMatchStateSerialized,
  IMatchStatus,
  MatchStatus,
} from '@game-of-three/contracts'

export type IUUIDStrategy = () => string
export type INumberGeneratorStrategy = () => number
export class Match<IPlayer1 extends IPlayer, IPlayer2 extends IPlayer>
  implements IMatch<IPlayer1, IPlayer2>, ISubject<IMatchStateSerialized> {
  public static readonly MAX = 100

  public static readonly MIN = 3

  public readonly __type: 'Match' = 'Match'

  private readonly _id: string

  private _initialized: boolean

  private readonly _matchStateHistory: IMatchState[]

  private readonly _numberGeneratorStrategy: INumberGeneratorStrategy

  private readonly _observers: IObserver<IMatchStateSerialized>[]

  private readonly _players: readonly [IPlayer1, IPlayer2]

  private readonly _turn: ITurn<IPlayer1, IPlayer2>

  public constructor(
    player1: IPlayer1,
    player2: IPlayer2,
    numberGeneratorStrategy?: INumberGeneratorStrategy,
    uuidStrategy: IUUIDStrategy = uuid
  ) {
    this._id = uuidStrategy()
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

  public get turn(): IPlayer1 | IPlayer2 {
    this._assertInitialized()
    return this._turn.current
  }

  public get turnNumber(): number {
    this._assertInitialized()
    return this._turn.number
  }

  public get id(): string {
    return this._id
  }

  public get state(): Readonly<IMatchState> {
    this._assertInitialized()
    const { length } = this._matchStateHistory

    if (length === 0) {
      throw new Error('Empty matchStateHistory.')
    }
    return this._matchStateHistory[length - 1]
  }

  public get stateHistory(): readonly Readonly<IMatchState>[] {
    this._assertInitialized()
    return this._matchStateHistory
  }

  public get status(): IMatchStatus {
    this._assertInitialized()
    return this.state.status
  }

  public get players(): readonly [IPlayer1, IPlayer2] {
    return this._players
  }

  public init(): void {
    if (this._initialized) {
      throw new Error(
        "Match already initialized. Can't re-initialize the Match"
      )
    } else {
      this._turn.init()
      const outputNumber = this._numberGeneratorStrategy()
      const nextTurn = this._turn.current
      const turnNumber = 0
      const initialMatchState: IMatchState = new MatchState({
        id: this.id,
        nextTurn,
        outputNumber,
        status: MatchStatus.Start,
        turnNumber,
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

  public get nextTurn(): IPlayer1 | IPlayer2 {
    this._assertInitialized()
    return this._turn.next
  }

  public push(matchState: IMatchState): void {
    this._assertInitialized()
    this._matchStateHistory.push(matchState)

    if (matchState.isPlaying()) {
      this._turn.switch()
    }
    this.notifyObservers()
  }

  public registerObserver(observer: IObserver<IMatchStateSerialized>): void {
    this._observers.push(observer)
  }

  public removeObserver(observer: IObserver<IMatchStateSerialized>): void {
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
