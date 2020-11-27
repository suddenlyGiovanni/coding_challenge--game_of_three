/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { Socket } from 'socket.io'

import { AIActor } from './ai-actor'
import type {
  IMatchService,
  IMatchState,
  IObserver,
  IPlayer,
} from './interfaces'
import { INumberGeneratorStrategy, Match, MatchState } from './model'
import {
  SocketActionFn,
  WrappedServerSocket,
  createSocket,
  emitToSocket,
} from './sockets'

import {
  Action,
  IAction,
  IEvents,
  IMatchStateSerialized,
  MatchStatus,
  PlayerID,
  SocketEvent,
  actionMatchMoveError,
  actionMatchNewState,
} from '@game-of-three/contracts'

export class MatchService<IPlayer1 extends IPlayer, IPlayer2 extends IPlayer>
  implements IMatchService {
  public readonly __type: 'MatchService' = 'MatchService'

  public readonly id: string

  private _aiActor?: AIActor<string>

  private readonly _aiActorMoveObserver: IObserver<IAction> = {
    update: (action: IAction) => this.move(this._match.players[1], action),
  }

  private readonly _debugObserver?: IObserver<IMatchStateSerialized<string>>

  private readonly _match: Match<IPlayer1, IPlayer2>

  private readonly _sockets?: [socket1: Socket, socket2?: Socket]

  private readonly registeredEventsListener: readonly [
    WrappedServerSocket<
      SocketEvent.MATCH_MOVE,
      Action<SocketEvent.MATCH_MOVE, IAction, never, never>
    >
  ]

  /**
   *Creates an instance of MatchService.
   * @param {[IPlayer1, IPlayer2]} players
   * @param {INumberGeneratorStrategy} [numberGeneratorStrategy]
   * @memberof MatchService
   */
  public constructor({
    sockets,
    players,
    numberGeneratorStrategy,
    debugObserver,
  }: {
    debugObserver?: IObserver<IMatchStateSerialized>
    numberGeneratorStrategy?: INumberGeneratorStrategy
    players: [player1: IPlayer1, player2: IPlayer2]
    sockets?: [socket1: Socket, socket2?: Socket]
  }) {
    this._match = new Match(...players, numberGeneratorStrategy)
    this.id = this._match.id
    this._sockets = sockets
    this._debugObserver = debugObserver

    this.registeredEventsListener = this._registerEventHandlersToSocketEvents()

    this._addAiActor()

    this._subscribeDebugObserverToMatchStateSubject()

    this._subscribeSocketsToMatchStateSubject()

    this._listenToSocketEvent()

    this._match.init()
  }

  private static _assertPlayerBelongToMatch(
    _match: Match<IPlayer<PlayerID>, IPlayer<PlayerID>>,
    playerId: PlayerID
  ): void {
    if (!_match.players.map((p) => p.id).includes(playerId)) {
      throw new Error('PlayerID does not belong to this match ')
    }
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
          id: this._match.id,
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
        id: this._match.id,
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
      id: this._match.id,
      inputNumber,
      outputNumber,
      status: MatchStatus.Stop,
      turnNumber: this._match.turnNumber,
      winningPlayer: this._match.nextTurn,
    })
    return this._match.setState(matchStateStop)
  }

  /**
   * TODO: DOCUMENT THIS METHOD
   * @private
   * @memberof MatchService
   */
  private _addAiActor() {
    const [, player2] = this._match.players
    if (player2.isAi()) {
      this._aiActor = new AIActor(player2)
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

  private _handlerMatchMoveAction: SocketActionFn<
    IEvents[SocketEvent.MATCH_MOVE]
  > = (socket) => ({ payload: action }) => {
    const { id } = socket

    MatchService._assertPlayerBelongToMatch(this._match, id)

    const player = this._match.players.find((p) => p.id === id)!

    // if (this._isPlayerTurn(player)) {}  FIXME: validate event have been received by current turn player
    const move = action // TODO: REMOVE ME!

    console.log(`client id: ${id} made a move: ${move}`) // TODO: REMOVE ME!
    try {
      this.move(player, move)
    } catch (error: unknown) {
      // TODO: emit a new message notifying the player that it can not move if it is not his turn!
      if (typeof error === 'string') {
        emitToSocket(socket)(
          SocketEvent.MATCH_MOVE_ERROR,
          actionMatchMoveError(error)
        )
      }
    }
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

  /**
   * TODO: DOCUMENT THIS METHOD
   * @private
   * @memberof MatchService
   */
  private _listenToSocketEvent(): void {
    this._sockets?.forEach((socket) => {
      if (socket) {
        this.registeredEventsListener.forEach(({ callback, event }) =>
          socket.on(event, callback(socket))
        )
      }
    })
  }

  /**
   * TODO: DOCUMENT THIS METHOD
   * @private
   * @returns
   * @memberof MatchService
   */
  private _registerEventHandlersToSocketEvents() {
    return [
      createSocket(SocketEvent.MATCH_MOVE, this._handlerMatchMoveAction),
    ] as const
  }

  /**
   * TODO: DOCUMENT THIS METHOD
   * @private
   * @memberof MatchService
   */
  private _subscribeDebugObserverToMatchStateSubject(): void {
    if (this._debugObserver) {
      this._match.registerObserver(this._debugObserver)
    }
  }

  /**
   * TODO: DOCUMENT THIS METHOD
   * @private
   * @memberof MatchService
   */
  private _subscribeSocketsToMatchStateSubject(): void {
    this._match.registerObserver({
      update: (matchStateSerialized) => {
        this._sockets?.forEach((socket) => {
          if (socket) {
            console.log(
              `emitting state to socket ${socket.id}`,
              matchStateSerialized
            ) // TODO: REMOVE ME!

            emitToSocket(socket)(
              SocketEvent.MATCH_NEW_STATE,
              actionMatchNewState(matchStateSerialized)
            )
          }
        })
      },
    })
  }
}
