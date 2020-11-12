import {
  IMatch,
  IMatchState,
  IMatchStateSerialized,
  IMatchStatus,
  IObserver,
  IPlayer,
  ISubject,
  ITurn,
} from '../interfaces'
import { MatchState, MatchStatus } from '../model/match-state'

import { Turn } from './turn'

export type NumberGeneratorStrategy = () => number
export class Match<
  IPlayer1 extends IPlayer<string>,
  IPlayer2 extends IPlayer<string>
> implements IMatch<IPlayer1, IPlayer2>, ISubject<IMatchStateSerialized> {
  public static readonly MAX = 100

  public static readonly MIN = 3

  private initialized: boolean

  private readonly matchStateHistory: IMatchState[]

  private readonly numberGeneratorStrategy: NumberGeneratorStrategy

  private readonly observers: IObserver<IMatchStateSerialized>[]

  private readonly players: readonly [IPlayer1, IPlayer2]

  private readonly turn: ITurn<IPlayer1, IPlayer2>

  public constructor(
    player1: IPlayer1,
    player2: IPlayer2,
    numberGeneratorStrategy?: NumberGeneratorStrategy
  ) {
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
    return this.turn.getCurrent()
  }

  public getCurrentTurnNumber(): number {
    this.assertInitialized()
    return this.turn.getTurnNumber()
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
      const nextTurn = this.turn.getCurrent()
      const turnNumber = 0
      const initialMatchState: IMatchState = new MatchState({
        nextTurn,
        outputNumber,
        status: MatchStatus.Start,
        turnNumber,
      })
      this.matchStateHistory.push(initialMatchState)
      this.initialized = true
      // TODO: should trigger a message of some sort to notify Match players
    }
  }

  // TODO: can't make a move if not your turn
  public move(action: 0 | 1 | -1): void {
    this.assertInitialized()
    this.assertMatchStatePlaying()
    const inputNumber = this.getNewInputNumber()
    const outputNumber = this.calculateOutputNumber(inputNumber, action)

    if (this.isPositiveIntegerValidator(outputNumber)) {
      // outputNumber could be:
      // 1. equal to 1 => end (status: victory)
      // 2. divisible by 3 => next turn
      // 3. not divisible by three

      if (this.isEqualToOneValidator(outputNumber)) {
        // victory
        const matchStateStop: IMatchState = new MatchState({
          action,
          currentTurn: this.turn.getCurrent(),
          inputNumber,
          outputNumber,
          status: MatchStatus.Stop,
          turnNumber: this.turn.getTurnNumber(),
          winningPlayer: this.turn.getCurrent(),
        })
        this.setMatchState(matchStateStop)
        return
      }

      if (this.isDivisibleByThreeValidator(outputNumber)) {
        // next round
        const matchStatePlaying: IMatchState = new MatchState({
          action,
          currentTurn: this.turn.getCurrent(),
          inputNumber,
          nextTurn: this.turn.peekNext(),
          outputNumber,
          status: MatchStatus.Playing,
          turnNumber: this.turn.getTurnNumber(),
        })
        this.setMatchState(matchStatePlaying)
        return
      }

      // lost
      const matchStateStop: IMatchState = new MatchState({
        action,
        currentTurn: this.turn.getCurrent(),
        inputNumber,
        outputNumber,
        status: MatchStatus.Stop,
        turnNumber: this.turn.getTurnNumber(),
        winningPlayer: this.turn.peekNext(),
      })
      this.setMatchState(matchStateStop)
      return
    } else {
      // end (status: lost)
      const matchStateStop: IMatchState = new MatchState({
        action,
        currentTurn: this.turn.getCurrent(),
        inputNumber,
        outputNumber,
        status: MatchStatus.Stop,
        turnNumber: this.turn.getTurnNumber(),
        winningPlayer: this.turn.peekNext(),
      })
      this.setMatchState(matchStateStop)
      return
    }
  }

  public notifyObservers(): void {
    this.observers.forEach((observer) => {
      observer.update(this.getMatchState().serialize())
    })
  }

  public peekNextTurn(): IPlayer1 | IPlayer2 {
    this.assertInitialized()
    return this.turn.peekNext()
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
      this.turn.next()
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

  private assertMatchStatePlaying(): void {
    if (this.getMatchStatus() === MatchStatus.Stop) {
      throw new Error("Match ended. Can't make a move after a match has ended")
    }
  }

  private calculateOutputNumber(
    inputNumber: number,
    action: -1 | 0 | 1
  ): number {
    return (inputNumber + action) / 3
  }

  private getNewInputNumber(): number {
    this.assertInitialized()
    const matchState = this.getMatchState()
    return matchState.outputNumber
  }

  private isDivisibleByThreeValidator(number: number): boolean {
    return number % 3 === 0
  }

  private isEqualToOneValidator(number: number): boolean {
    return number === 1
  }

  private isPositiveIntegerValidator(number: number): boolean {
    return Number.isInteger(number) && number > 0
  }
}
