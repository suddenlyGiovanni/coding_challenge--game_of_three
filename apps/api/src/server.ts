import { Server as IOServer, Socket } from 'socket.io'

import type { IPlayersStore, IServer } from './interfaces'
import { Human } from './model'

import { PlayersStore } from './players-store'

export type SocketActionFn<T> = (socket: Socket) => (message: T) => void
export interface WrappedServerSocket<T> {
  callback: SocketActionFn<T>
  event: string
}

export enum SocketEvent {
  //#region SYSTEM RESERVED EVENTS

  /**
   * Fired upon a connection from client.
   * socket (Socket) socket connection with client
   * @example
   * ```
   * io.on('connection', (socket) => {
   *  // ...
   * });
   *
   * io.of('/admin').on('connection', (socket) => {
   *  // ...
   * });
   * ```
   */
  CONNECT = 'connect',
  /**
   * Synonym of Event: ‘connect’.
   */
  CONNECTION = 'connection',
  /**
   * Fired upon disconnection
   * reason (String) the reason of the disconnection (either client or server-side):
   *
   * | `transport error`
   * | `server namespace disconnect`
   * | `client namespace disconnect`
   * | `ping timeout`
   * | `transport close`
   * @example
   * ```
   * io.on('connection', (socket) => {
   *  socket.on('disconnect', (reason) => {
   *    // ...
   *   });
   * });
   * ```
   */
  DISCONNECT = 'disconnect',

  /**
   * Fired when the client is going to be disconnected (but hasn’t left its rooms yet).
   * reason (String) the reason of the disconnection (either client or server-side)
   * @example
   * ```
   * io.on('connection', (socket) => {
   *  socket.on('disconnecting', (reason) => {
   *    console.log(socket.rooms); // Set { ... }
   *  });
   * });
   * ```
   */
  DISCONNECTING = 'disconnecting',

  /**
   * Fired upon a connection error
   */
  CONNECT_ERROR = 'connect_error',

  /**
   * Fired upon a connection timeout
   */
  CONNECT_TIMEOUT = 'connect_timeout',

  /**
   * Fired upon an attempt to reconnect
   */
  RECONNECT_ATTEMPT = 'reconnect_attempt',

  /**
   * Fired upon a reconnection attempt error
   */
  reconnect_error = 'reconnect_error',

  /**
   * Fired when the client couldn’t reconnect within reconnectionAttempts
   */
  RECONNECT_FAILED = 'reconnect_failed',

  /**
   * Alias for “reconnect_attempt”
   */
  RECONNECTING = 'reconnecting',

  /**
   * Fired upon a successful reconnection
   */
  RECONNECT = 'reconnect',

  /**
   * Fired when a `ping` is sent to the server
   */
  PING = 'ping',

  /**
   * Fired when a `pong` is received from the server
   */
  PONG = 'pong',

  NEW_LISTENER = 'newListener',

  REMOVE_LISTENER = 'removeListener',

  //#endregion SYSTEM RESERVED EVENTS

  HEARTBEAT = 'heartbeat',
  HELLO = 'hello',
}

export class Server implements IServer {
  public static readonly PORT: number = 3000

  private static instance: Server

  private heartbeatTimerID: NodeJS.Timeout

  private readonly io: IOServer

  private readonly playersStore: IPlayersStore

  private readonly port: number

  private constructor() {
    this.port = Number(process.env.port) || Server.PORT
    this.io = new IOServer(this.port, {
      cors: { origin: [`http://localhost:4200`] },
    })

    this.playersStore = PlayersStore.getInstance()

    console.log(`Listening at ws://localhost:${this.port}`)
  }

  public static getInstance(): Server {
    if (!Server.instance) {
      Server.instance = new Server()
    }
    return Server.instance
  }

  public getIO(): IOServer {
    return this.io
  }

  public listen = (): void => {
    this.io.on(SocketEvent.CONNECTION, this._registerSocketToEventListeners)
    this.heartbeatTimerID = setInterval(
      () => this.io.emit(SocketEvent.HEARTBEAT, new Date().toISOString()),
      1000
    )
  }

  private _createSocket<T>(
    event: SocketEvent,
    action?: SocketActionFn<T>
  ): WrappedServerSocket<T> {
    return { callback: action, event }
  }

  private _handleUserConnect = (socket: Socket) => {
    console.log(`_handleUserConnect: ${socket.id}`)
    // add user to the store
    const player = new Human(socket.id)
    this.playersStore.addPlayer(player)

    console.log(this.playersStore.players) // TODO: Remove store debug

    // do other stuff...
  }

  private _handleUserDisconnect: SocketActionFn<void> = (socket) => () => {
    console.log(`disconnect: ${socket.id}`)
    // const user = this.userStore.getUserByID(uuid)
    // remove the user for the Lobby?
    // notify the interested clients: (players in the lobby, player in a match if affected)
    // remove the user from the store

    const player = this.playersStore.removePlayerByID(socket.id)
    if (player) console.log(`player id:${socket.id} disconnected.`, player)
    console.log(this.playersStore.players) // TODO: Remove store debug
  }

  private _handlerEventHello: SocketActionFn<string> = (socket) => (
    message
  ): void => {
    console.log(`hello ${message} from ${socket.id}`)
  }

  private _registerSocketToEventListeners = (socket: Socket): void => {
    const registeredEvents = [
      this._createSocket<void>(
        SocketEvent.DISCONNECT,
        this._handleUserDisconnect
      ),
      this._createSocket<string>(SocketEvent.HELLO, this._handlerEventHello),
    ] as const

    registeredEvents.forEach(({ callback, event }) =>
      socket.on(event, callback(socket))
    )

    this._handleUserConnect(socket)
  }
}
