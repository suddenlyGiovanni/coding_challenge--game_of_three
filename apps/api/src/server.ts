import { Server as IOServer } from 'socket.io'
import type { Socket } from 'socket.io'

import type { IServer } from './interfaces/server.interface'

export enum EventType {
  CONNECT = 'connect',
  LOGIN = 'login',
  LOGIN_SUCCESS = 'login_success',
  DISCONNECT = 'disconnect',
  DISCONNECTING = 'disconnecting',

  PLAYER_JOINED = 'player_joined',
  PLAYER_LEFT = 'player_left',

  NEW_GAME = 'new_game',
}

export class Server implements IServer {
  public static readonly PORT: number = 3333

  private static instance: Server

  private readonly io: IOServer

  private readonly port: number

  private constructor() {
    this.port = Number(process.env.port) || Server.PORT
    this.io = new IOServer(this.port)
    console.log('initiating server')
    this._listen()
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

  private _listen = (): void => {
    console.log(`Listening at ws://localhost:${this.port}`)
    this.io.on(EventType.CONNECT, (socket: Socket): void => {
      console.log(`connect ${socket.id}`)

      socket.on('ping', (cb: () => void) => {
        console.log('ping')
        cb()
      })

      socket.on(EventType.CONNECT, (): void => {
        console.log(`disconnect ${socket.id}`)
      })
    })
  }
}
