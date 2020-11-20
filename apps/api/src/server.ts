import { Server as IOServer, Socket } from 'socket.io'

import type { IPlayersStore, IServer } from './interfaces'
import { Human } from './model'
import { PlayersStore } from './players-store'

import { ISocketEvent, SocketEvent } from '@game-of-three/api-interfaces'

export type SocketActionFn<T> = (socket: Socket) => (message: T) => void
export interface WrappedServerSocket<T> {
  callback: SocketActionFn<T>
  event: string
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
    event: ISocketEvent,
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
