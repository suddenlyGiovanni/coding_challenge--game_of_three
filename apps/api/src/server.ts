import { Server as IOServer } from 'socket.io'
import type { Socket } from 'socket.io'

import type { IServer } from './interfaces/server.interface'

export enum EventType {
  CONNECTION = 'connection',
  CONNECT = 'connect',
  LOGIN = 'login',
  LOGIN_SUCCESS = 'login_success',
  DISCONNECT = 'disconnect',
  DISCONNECTING = 'disconnecting',

  PLAYER_JOINED = 'player_joined',
  PLAYER_LEFT = 'player_left',

  NEW_GAME = 'new_game',

  HELLO = 'hello!',

  MESSAGE = 'message',
}

export class Server implements IServer {
  public static readonly PORT: number = 3000

  private static instance: Server

  private readonly io: IOServer

  private readonly port: number

  private constructor() {
    this.port = Number(process.env.port) || Server.PORT
    this.io = new IOServer(this.port, {
      cors: { origin: [`http://localhost:4200`] },
    })

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
    this.io.on(EventType.CONNECTION, this._onSocketConnect)

    setInterval(() => {
      this.io.emit(EventType.MESSAGE, new Date().toISOString())
    }, 1000)
  }

  private _onSocketConnect = (socket: Socket): void => {
    console.log(`connect: ${socket.id}`)

    socket.on(EventType.HELLO, () => {
      console.log(`hello from ${socket.id}`)
    })

    socket.on(EventType.DISCONNECT, () => {
      console.log(`disconnect: ${socket.id}`)
    })
  }
}
