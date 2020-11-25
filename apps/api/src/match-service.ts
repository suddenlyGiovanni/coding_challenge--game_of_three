import { AIActor } from './ai-actor'
import type {
  IMatchService,
  IMatchState,
  IObserver,
  IPlayer,
} from './interfaces'
import { INumberGeneratorStrategy, Match, MatchState } from './model'

import {
  IAction,
  IMatchStateSerialized,
  MatchStatus,
} from '@game-of-three/contracts'

export class MatchService<IPlayer1 extends IPlayer, IPlayer2 extends IPlayer>
  implements IMatchService {
  private readonly _aiActor: AIActor<string>

  private readonly _aiActorMoveObserver: IObserver<IAction> = {
    update: (action: IAction) => this.move(this._match.players[1], action),
  }

  private readonly _match: Match<IPlayer1, IPlayer2>

  /**
   *Creates an instance of MatchService.
   * @param {[IPlayer1, IPlayer2]} players
   * @param {INumberGeneratorStrategy} [numberGeneratorStrategy]
   * @memberof MatchService
   */
  public constructor(
    players: [IPlayer1, IPlayer2],
    numberGeneratorStrategy?: INumberGeneratorStrategy,
    debugObserver?: IObserver<IMatchStateSerialized>
  ) {
    this._match = new Match(...players, numberGeneratorStrategy)
    if (players[1].isAi()) {
      this._aiActor = new AIActor(players[1])
      /**
       * register the Observable responsible for listening to the AiActors move.
       * said Observable will be responsible to proxy the message to the match state model
       */
      this._aiActor.registerObserver(this._aiActorMoveObserver)

      /**
       * register the AiActor to the match state changes.
       */
      this._match.registerObserver(this._aiActor)
    }
    if (debugObserver) {
      this._match.registerObserver(debugObserver)
    }
    this._match.init()
  }

  public move(player: IPlayer, action: IAction): void {
    this._assertMatchStatePlaying()
    this._assertIsPlayerTurn(player)
    const inputNumber = this._getNewInputNumber()
    const outputNumber = this._calculateOutputNumber(inputNumber, action)

    if (
      this._isDivisibleByThree(inputNumber + action) &&
      this._isPositiveInteger(outputNumber)
    ) {
      if (this._isEqualToOne(outputNumber)) {
        // victory
        const matchStateStop: IMatchState = new MatchState({
          action,
          currentTurn: this._match.turn,
          inputNumber,
          outputNumber,
          status: MatchStatus.Stop,
          turnNumber: this._match.turnNumber,
          winningPlayer: this._match.turn,
        })
        return this._match.setState(matchStateStop)
      }
      // next round
      const matchStatePlaying = new MatchState({
        action,
        currentTurn: this._match.turn,
        inputNumber,
        nextTurn: this._match.nextTurn,
        outputNumber,
        status: MatchStatus.Playing,
        turnNumber: this._match.turnNumber,
      })
      return this._match.setState(matchStatePlaying)
    }

    // lost
    const matchStateStop = new MatchState({
      action,
      currentTurn: this._match.turn,
      inputNumber,
      outputNumber,
      status: MatchStatus.Stop,
      turnNumber: this._match.turnNumber,
      winningPlayer: this._match.nextTurn,
    })
    return this._match.setState(matchStateStop)
  }

  private _assertIsPlayerTurn(player: IPlayer): void {
    if (!this._isPlayerTurn(player)) {
      throw new Error('Not player turn.')
    }
  }

  private _assertMatchStatePlaying(): void {
    if (this._isMatchStop()) {
      throw new Error("Match ended. Can't make a move after a match has ended")
    }
  }

  private _calculateOutputNumber(inputNumber: number, action: IAction): number {
    return (inputNumber + action) / 3
  }

  private _getNewInputNumber(): number {
    return this._match.state.outputNumber
  }

  private _isDivisibleByThree(number: number): boolean {
    return number % 3 === 0
  }

  private _isEqualToOne(number: number): boolean {
    return number === 1
  }

  /**
   * returns `true` if the match is in the `Stop` status
   * @private
   * @returns {boolean}
   * @memberof MatchService
   */
  private _isMatchStop(): boolean {
    return this._match.status === MatchStatus.Stop
  }

  private _isPlayerTurn(player: IPlayer): boolean {
    return this._match.turn === player
  }

  private _isPositiveInteger(number: number): boolean {
    return Number.isInteger(number) && number > 0
  }
}
