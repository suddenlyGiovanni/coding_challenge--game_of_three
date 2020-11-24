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
export class Match<
  IPlayer1 extends IPlayer<string>,
  IPlayer2 extends IPlayer<string>
> implements IMatch<IPlayer1, IPlayer2>, ISubject<IMatchStateSerialized> {
  public static readonly MAX = 100

  public static readonly MIN = 3

  private readonly id: string

  private initialized: boolean

  private readonly matchStateHistory: IMatchState[]

  private readonly numberGeneratorStrategy: INumberGeneratorStrategy

  private readonly observers: IObserver<IMatchStateSerialized>[]

  private readonly players: readonly [IPlayer1, IPlayer2]

  private readonly turn: ITurn<IPlayer1, IPlayer2>

  public constructor(
    player1: IPlayer1,
    player2: IPlayer2,
    numberGeneratorStrategy?: INumberGeneratorStrategy,
    uuidStrategy: IUUIDStrategy = uuid
  ) {
    this.id = uuidStrategy()
    this.initialized = false
    this.players = [player1, player2] as const
    this.turn = new Turn(player1, player2)
    this.matchStateHistory = []
    this.observers = []

    if (numberGeneratorStrategy) {
      this.numberGeneratorStrategy = numberGeneratorStrategy
    } else {
      this.numberGeneratorStrategy = () =>
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

  public getCurrentTurn(): IPlayer1 | IPlayer2 {
    this.assertInitialized()
    return this.turn.current
  }

  public getCurrentTurnNumber(): number {
    this.assertInitialized()
    return this.turn.number
  }

  public getId(): string {
    return this.id
  }

  public getMatchState(): Readonly<IMatchState> {
    this.assertInitialized()
    const { length } = this.matchStateHistory

    if (length === 0) {
      throw new Error('Empty matchStateHistory.')
    }
    return this.matchStateHistory[length - 1]
  }

  public getMatchStateHistory(): readonly Readonly<IMatchState>[] {
    this.assertInitialized()
    return this.matchStateHistory
  }

  public getMatchStatus(): IMatchStatus {
    this.assertInitialized()
    return this.getMatchState().status
  }

  public getPlayers(): readonly [IPlayer1, IPlayer2] {
    return this.players
  }

  public init(): void {
    if (this.initialized) {
      throw new Error(
        "Match already initialized. Can't re-initialize the Match"
      )
    } else {
      this.turn.init()
      const outputNumber = this.numberGeneratorStrategy()
      const nextTurn = this.turn.current
      const turnNumber = 0
      const initialMatchState: IMatchState = new MatchState({
        nextTurn,
        outputNumber,
        status: MatchStatus.Start,
        turnNumber,
      })
      this.matchStateHistory.push(initialMatchState)
      this.initialized = true
      this.notifyObservers()
    }
  }

  public notifyObservers(): void {
    this.observers.forEach((observer) => {
      observer.update(this.getMatchState().serialize())
    })
  }

  public peekNextTurn(): IPlayer1 | IPlayer2 {
    this.assertInitialized()
    return this.turn.next
  }

  public registerObserver(observer: IObserver<IMatchStateSerialized>): void {
    this.observers.push(observer)
  }

  public removeObserver(observer: IObserver<IMatchStateSerialized>): void {
    const index = this.observers.indexOf(observer)
    if (index !== -1) {
      this.observers.splice(index, 1)
    }
  }

  public setMatchState(matchState: IMatchState): void {
    this.assertInitialized()
    this.matchStateHistory.push(matchState)

    if (matchState.isPlaying()) {
      this.turn.switch()
    }
    this.notifyObservers()
  }

  private assertInitialized(): void {
    if (this.initialized === false) {
      throw new Error(
        'Match not initialize. Remember to invoke `init()` after instantiation.'
      )
    }
  }
}
