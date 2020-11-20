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
} from '@game-of-three/api-interfaces'

export class MatchService<
  IPlayer1 extends IPlayer<string>,
  IPlayer2 extends IPlayer<string>
> implements IMatchService {
  private readonly aiActor: AIActor<string>

  private readonly aiActorMoveObserver: IObserver<IAction> = {
    update: (action: IAction) => this.move(this.match.getPlayers()[1], action),
  }

  private readonly match: Match<IPlayer1, IPlayer2>

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
    this.match = new Match(...players, numberGeneratorStrategy)
    if (players[1].isAi()) {
      this.aiActor = new AIActor(players[1])
      /**
       * register the Observable responsible for listening to the AiActors move.
       * said Observable will be responsible to proxy the message to the match state model
       */
      this.aiActor.registerObserver(this.aiActorMoveObserver)

      /**
       * register the AiActor to the match state changes.
       */
      this.match.registerObserver(this.aiActor)
    }
    if (debugObserver) {
      this.match.registerObserver(debugObserver)
    }
    this.match.init()
  }

  public move(player: IPlayer, action: IAction): void {
    this.assertMatchStatePlaying()
    this.assertIsPlayerTurn(player)
    const inputNumber = this.getNewInputNumber()
    const outputNumber = this.calculateOutputNumber(inputNumber, action)

    if (
      this.isDivisibleByThree(inputNumber + action) &&
      this.isPositiveInteger(outputNumber)
    ) {
      if (this.isEqualToOne(outputNumber)) {
        // victory
        const matchStateStop: IMatchState = new MatchState({
          action,
          currentTurn: this.match.getCurrentTurn(),
          inputNumber,
          outputNumber,
          status: MatchStatus.Stop,
          turnNumber: this.match.getCurrentTurnNumber(),
          winningPlayer: this.match.getCurrentTurn(),
        })
        return this.match.setMatchState(matchStateStop)
      }
      // next round
      const matchStatePlaying = new MatchState({
        action,
        currentTurn: this.match.getCurrentTurn(),
        inputNumber,
        nextTurn: this.match.peekNextTurn(),
        outputNumber,
        status: MatchStatus.Playing,
        turnNumber: this.match.getCurrentTurnNumber(),
      })
      return this.match.setMatchState(matchStatePlaying)
    }

    // lost
    const matchStateStop = new MatchState({
      action,
      currentTurn: this.match.getCurrentTurn(),
      inputNumber,
      outputNumber,
      status: MatchStatus.Stop,
      turnNumber: this.match.getCurrentTurnNumber(),
      winningPlayer: this.match.peekNextTurn(),
    })
    return this.match.setMatchState(matchStateStop)
  }

  private assertIsPlayerTurn(player: IPlayer): void {
    if (!this.isPlayerTurn(player)) {
      throw new Error('Not player turn.')
    }
  }

  private assertMatchStatePlaying(): void {
    if (this.isMatchStop()) {
      throw new Error("Match ended. Can't make a move after a match has ended")
    }
  }

  private calculateOutputNumber(inputNumber: number, action: IAction): number {
    return (inputNumber + action) / 3
  }

  private getNewInputNumber(): number {
    return this.match.getMatchState().outputNumber
  }

  private isDivisibleByThree(number: number): boolean {
    return number % 3 === 0
  }

  private isEqualToOne(number: number): boolean {
    return number === 1
  }

  /**
   * returns `true` if the match is in the `Stop` status
   * @private
   * @returns {boolean}
   * @memberof MatchService
   */
  private isMatchStop(): boolean {
    return this.match.getMatchStatus() === MatchStatus.Stop
  }

  private isPlayerTurn(player: IPlayer): boolean {
    return this.match.getCurrentTurn() === player
  }

  private isPositiveInteger(number: number): boolean {
    return Number.isInteger(number) && number > 0
  }
}
