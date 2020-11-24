import { clearInterval } from 'timers'

import { Server as IOServer, Socket } from 'socket.io'

import type { IPlayersStore, IServer } from './interfaces'
import { Human } from './model'
import { PlayersStore } from './players-store'

import { IEvents, SocketEvent } from '@game-of-three/contracts'

export type SocketActionFn<Payload> = (
  socket: Socket
) => (payload: Payload) => void
export interface WrappedServerSocket<
  Event extends keyof IEvents,
  Payload extends IEvents[Event]
> {
  callback: SocketActionFn<Payload>
  event: Event
}

export class Server implements IServer {
  public static readonly CORS_ORIGIN: string = `http://localhost:4200`

  public static readonly PORT: number = 3000

  private static instance: Server

  private heartbeatTimerID: NodeJS.Timeout

  private readonly io: IOServer

  private readonly playersStore: IPlayersStore

  private readonly port: number

  private constructor() {
    this.port = Number(process.env.port) || Server.PORT
    this.io = new IOServer(this.port, {
      cors: {
        origin: [Server.CORS_ORIGIN],
      },
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
    this.io.on(
      SocketEvent.INTERNAL_CONNECTION,
      this._registerSocketToEventListeners
    )
    this._startEmitHeartbeat()
  }

  public stop(): void {
    this._stopEmitHeartbeat()
    this.io.close()
  }

  private _broadcast<Event extends keyof IEvents>(
    event: Event,
    action: IEvents[Event]
  ): void {
    this.io?.emit(event, action)
  }

  private _broadcastToAllButThisSocket = (socket: Socket) => <
    Event extends keyof IEvents
  >(
    event: Event,
    action: IEvents[Event]
  ): void => {
    socket.broadcast.emit(event, action)
  }

  private _createSocket<
    Event extends keyof IEvents,
    Payload extends IEvents[Event]
  >(
    event: Event,
    callback?: SocketActionFn<Payload>
  ): WrappedServerSocket<Event, Payload> {
    return { callback, event } as const
  }

  private _emitToSocket = (socket: Socket) => <Event extends keyof IEvents>(
    event: Event,
    action: IEvents[Event]
  ): void => {
    socket.emit(event, action)
  }

  private _handleClientInitializeData = (socket: Socket) => {
    const actionInitialize = {
      payload: this.playersStore.getSerializedPlayer(),
      type: SocketEvent.SYSTEM_INITIALIZE,
    } as const
    this._emitToSocket(socket)(SocketEvent.SYSTEM_INITIALIZE, actionInitialize)
  }

  private _handleMatchMaking: SocketActionFn<
    IEvents[SocketEvent.LOBBY_MAKE_MATCH]
  > = (socket) => ({ payload }) => {
    console.log(`user id: ${socket.id} - match making ${payload}`)
  }

  private _handleMatchMove: SocketActionFn<IEvents[SocketEvent.MATCH_MOVE]> = (
    socket
  ) => (action) => {
    // route the match move to the correct match ('room')
    const { id } = socket
    const { payload: move } = action
    console.log(`user id: ${id} - match move: ${move}`) // TODO: remove this console.log
  }

  private _handleNameUpdate: SocketActionFn<
    IEvents[SocketEvent.SYSTEM_NAME_UPDATE]
  > = (socket) => (action) => {
    const { id } = socket
    const { payload: name } = action
    // update user name
    // 1. get player
    const player = this.playersStore.getPlayerByID(id)
    // 2. update name
    player.setName(name)
    console.log(`user id: ${id} - name changed: ${name}`) // TODO: remove this console.log

    // 3. notify clients of name changes
    this._broadcast(SocketEvent.SYSTEM_NAME_CHANGED, {
      payload: this.playersStore.getPlayerByID(id).serialize(),
      type: SocketEvent.SYSTEM_NAME_CHANGED,
    })
  }

  private _handleUserConnect = (socket: Socket) => {
    const { id } = socket
    console.log(`user connected id: ${id}`) // TODO: remove this console.log
    // add user to the store
    const player = new Human(id)
    this.playersStore.addPlayer(player)

    // notify socket of who is online
    this._handleClientInitializeData(socket)

    // notify all connected clients (except this client) that a new client has joined
    this._broadcastToAllButThisSocket(socket)(
      SocketEvent.SYSTEM_PLAYER_JOINED,
      {
        payload: player.serialize(),
        type: SocketEvent.SYSTEM_PLAYER_JOINED,
      }
    )
  }

  private _handleUserDisconnect: SocketActionFn<
    IEvents[SocketEvent.INTERNAL_DISCONNECT]
  > = (socket) => () => {
    const { id } = socket

    // const user = this.userStore.getUserByID(uuid)
    // remove the user for the Lobby?
    // notify the interested clients: (players in the lobby, player in a match if affected)
    // remove the user from the store

    const player = this.playersStore.removePlayerByID(id)
    if (player) {
      console.log(`user disconnected id: ${id}`) // TODO: remove this console.log

      // notify connected client that a client has disconnected

      this._broadcastToAllButThisSocket(socket)(
        SocketEvent.SYSTEM_PLAYER_LEFT,
        {
          payload: player.serialize(),
          type: SocketEvent.SYSTEM_PLAYER_LEFT,
        }
      )
    }
  }

  private _handlerEventHello: SocketActionFn<
    IEvents[SocketEvent.SYSTEM_HELLO]
  > = (socket) => (action) => {
    const { id } = socket
    const { payload } = action
    console.log(`user message '${payload}' id: ${id}`) // TODO: remove this console.log
  }

  private _registerSocketToEventListeners = (socket: Socket): void => {
    const registeredEvents = [
      this._createSocket(
        SocketEvent.INTERNAL_DISCONNECT,
        this._handleUserDisconnect
      ),
      this._createSocket(SocketEvent.SYSTEM_HELLO, this._handlerEventHello),
      this._createSocket(
        SocketEvent.SYSTEM_NAME_UPDATE,
        this._handleNameUpdate
      ),

      this._createSocket(SocketEvent.MATCH_MOVE, this._handleMatchMove),

      this._createSocket(SocketEvent.LOBBY_MAKE_MATCH, this._handleMatchMaking),
    ] as const

    registeredEvents.forEach(({ callback, event }) =>
      socket.on(event, callback(socket))
    )

    this._handleUserConnect(socket)
  }

  private _startEmitHeartbeat(): void {
    this.heartbeatTimerID = setInterval(
      () =>
        this._broadcast(SocketEvent.SYSTEM_HEARTBEAT, {
          payload: new Date().toISOString(),
          type: SocketEvent.SYSTEM_HEARTBEAT,
        }),
      1000
    )
  }

  private _stopEmitHeartbeat(): void {
    clearInterval(this.heartbeatTimerID)
  }
}
