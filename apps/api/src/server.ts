import { Server as IOServer } from 'socket.io'
import type { Socket } from 'socket.io'

import type { IServer } from './interfaces/server.interface'

export enum EventType {
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
  CONNECT_ERROR = 'connect_error',
  NEW_LISTENER = 'newListener',
  REMOVE_LISTENER = 'removeListener',

  //#endregion SYSTEM RESERVED EVENTS
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
      this.io.emit('message', new Date().toISOString())
    }, 1000)
  }

  private _onSocketConnect = (socket: Socket): void => {
    console.log(`connect: ${socket.id}`)

    socket.on('hello!', () => {
      console.log(`hello from ${socket.id}`)
    })

    socket.on(EventType.DISCONNECT, () => {
      console.log(`disconnect: ${socket.id}`)
    })
  }
}
