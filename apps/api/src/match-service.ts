/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { Socket } from 'socket.io'

import { AIActor } from './ai-actor'
import type { IMatchService, IObserver, IPlayer } from './interfaces'
import { INumberGeneratorStrategy, Match, MatchState } from './model'
import {
  SocketActionFn,
  WrappedServerSocket,
  createSocket,
  emitToSocket,
} from './sockets'

import {
  MatchStatus,
  SocketEvent,
  assertIsAction,
  eventMatchMoveError,
  eventMatchNewState,
} from '@game-of-three/contracts'

import type {
  IAction,
  IEventPayload,
  IEvents,
  IMatchEntity,
} from '@game-of-three/contracts'

export class MatchService<
  PlayerID1 extends string = string,
  PlayerID2 extends string = string,
  MatchID extends string = string
> implements IMatchService<MatchID, PlayerID1, PlayerID2> {
  public readonly __type: 'MatchService' = 'MatchService'

  public readonly id: MatchID

  public readonly onMatchEnd?: (matchId: MatchID) => void

  private _aiActor?: AIActor<string>

  private readonly _aiActorMoveObserver: IObserver<IAction> = {
    update: (action: IAction) => this.move(this._match.players[1], action),
  }

  private readonly _debugObserver?: IObserver<IMatchEntity>

  private readonly _match: Match<PlayerID1, PlayerID2, MatchID>

  private readonly _matchEndObserver: IObserver<IMatchEntity> = {
    update: () => this._isMatchStop() && this._onMatchEnd(),
  }

  /**
   * socket observer
   * on matchState updates it proxy the changes to the player sockets
   * @private
   * @type {IObserver<IMatchEntity>}
   * @memberof MatchService
   */
  private readonly _socketObserver: IObserver<IMatchEntity> = {
    update: (matchState) => {
      this._sockets?.forEach((socket) =>
        emitToSocket(socket)(
          SocketEvent.MATCH_NEW_STATE,
          eventMatchNewState(matchState)
        )
      )
    },
  }

  private readonly _sockets?: [socket1: Socket, socket2?: Socket]

  private readonly registeredSocketEventsListener: readonly [
    WrappedServerSocket<
      SocketEvent.MATCH_MOVE,
      IEventPayload<SocketEvent.MATCH_MOVE, IAction, never, never>
    >
  ]

  public constructor({
    sockets,
    players,
    numberGeneratorStrategy,
    debugObserver,
    onMatchEnd,
  }: {
    debugObserver?: IObserver<IMatchEntity>
    numberGeneratorStrategy?: INumberGeneratorStrategy
    onMatchEnd?: (matchId: string) => void
    players: [player1: IPlayer<PlayerID1>, player2: IPlayer<PlayerID2>]
    sockets?: [socket1: Socket, socket2?: Socket]
  }) {
    this._match = new Match(...players, numberGeneratorStrategy)
    this.id = this._match.id
    this._sockets = sockets
    this._debugObserver = debugObserver
    this.onMatchEnd = onMatchEnd

    this.registeredSocketEventsListener = this._registerEventHandlersToSocketEvents()

    this._addAiActor()
    this._subscribeObserversToMatchSubject()
    this._listenToPlayersEvents()
    this._match.init()
  }

  private static _assertPlayerBelongToMatch(
    _match: Match,
    playerId: string
  ): void {
    if (!_match.players.map((p) => p.id).includes(playerId)) {
      throw new Error('PlayerID does not belong to this match ')
    }
  }

  public move(
    player: IPlayer<PlayerID1> | IPlayer<PlayerID2>,
    action: IAction
  ): void {
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
        const matchStateStop = new MatchState<MatchID, PlayerID1, PlayerID2>({
          action,
          currentTurn: this._match.turn,
          id: this._match.id,
          inputNumber,
          outputNumber,
          players: this._match.players,
          status: MatchStatus.Stop,
          turnNumber: this._match.turnNumber,
          winningPlayer: this._match.turn,
        })
        return this._match.push(matchStateStop)
      }
      // next round
      const matchStatePlaying = new MatchState<MatchID, PlayerID1, PlayerID2>({
        action,
        currentTurn: this._match.turn,
        id: this._match.id,
        inputNumber,
        nextTurn: this._match.nextTurn,
        outputNumber,
        players: this._match.players,
        status: MatchStatus.Playing,
        turnNumber: this._match.turnNumber,
      })
      return this._match.push(matchStatePlaying)
    }

    // lost
    const matchStateStop = new MatchState<MatchID, PlayerID1, PlayerID2>({
      action,
      currentTurn: this._match.turn,
      id: this._match.id,
      inputNumber,
      outputNumber,
      players: this._match.players,
      status: MatchStatus.Stop,
      turnNumber: this._match.turnNumber,
      winningPlayer: this._match.nextTurn,
    })
    return this._match.push(matchStateStop)
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
    const emit = emitToSocket(socket)
    try {
      MatchService._assertPlayerBelongToMatch(this._match, id)
      assertIsAction(action)
      this.move(this._match.players.find((player) => player.id === id)!, action)
    } catch (error: unknown) {
      console.warn(error)
      if (error instanceof Error) {
        emit(SocketEvent.MATCH_MOVE_ERROR, eventMatchMoveError(error.message))
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
  private _listenToPlayersEvents(): void {
    if (this._aiActor) {
      /**
       * register the Observable responsible for listening to the AiActors move.
       * said Observable will be responsible to proxy the message to the match state model
       */
      this._aiActor.registerObserver(this._aiActorMoveObserver)
    }
    this._sockets?.forEach((socket) => {
      if (socket) {
        this.registeredSocketEventsListener.forEach(({ callback, event }) =>
          socket.on(event, callback(socket))
        )
      }
    })
  }

  private _notifyPlayersMatchHasEnded(): void {
    this._sockets?.forEach((socket) => {
      emitToSocket(socket)(SocketEvent.MATCH_END_STATE, undefined)
    })
  }

  /**
   * this procedure is responsible for cleaning up after a match has ended:
   * 1. remove removeObserver from match
   * 2. emit a message to sockets that the match has ended
   * 3. stop listening to sockets events
   * 4. notify server that the game has ended and that it can be killed
   * @private
   * @memberof MatchService
   */
  private _onMatchEnd = (): void => {
    this._removeObserversFromMatchStateSubject() // 1.
    this._notifyPlayersMatchHasEnded() // 2.
    this._stopListeningToPlayersEvents() // 3.
    this.onMatchEnd && this.onMatchEnd(this.id) // 4.
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
      // add more event handlers if needed.
    ] as const
  }

  private _removeObserversFromMatchStateSubject(): void {
    if (this._debugObserver) this._match.removeObserver(this._debugObserver)
    if (this._aiActor) this._match.removeObserver(this._aiActor)
    this._match.removeObserver(this._socketObserver)
    this._match.removeObserver(this._matchEndObserver)
  }

  private _stopListeningToPlayersEvents(): void {
    if (this._aiActor) {
      this._aiActor.removeObserver(this._aiActorMoveObserver)
    }
    this._sockets?.forEach((socket) =>
      this.registeredSocketEventsListener.forEach(({ callback, event }) => {
        /*
         * FIXME: this is not working because callback(socket) has no  stable reference by pointer
         * callback is a curried function: hence a new fn is created at each invocation.
         * Should find a way to properly remove it
         */
        socket.off(event, callback(socket))
      })
    )
  }

  private _subscribeObserversToMatchSubject(): void {
    if (this._debugObserver) {
      this._match.registerObserver(this._debugObserver)
    }

    //  register the AiActor to the match state changes.
    if (this._aiActor) {
      this._match.registerObserver(this._aiActor)
    }

    // register sockets to match state changes
    this._match.registerObserver(this._socketObserver)

    // register an on match end handler to match state changes
    this._match.registerObserver(this._matchEndObserver)
  }
}
