/* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call */
import { AssertionError } from 'assert'
import { EventEmitter } from 'events'

import Debug from 'debug'
import { Manager, Socket } from 'socket.io-client'

import type { ManagerOptions } from 'socket.io-client/build/manager'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const debug: (formatter: any, ...args: any[]) => void = Debug(
  'app:SocketClient'
)

interface IRespond {
  isSuccess: boolean
  message: string
  roomId: string
  userIds: string[]
}

/**
 *
 *
 * @export
 * @class SocketClient
 * @extends {EventEmitter}
 */
export class MockSocketClient extends EventEmitter {
  public isConnected: boolean

  public isConnecting: boolean

  private _chats: string[]

  private _roomId: string

  private _socket: null | Socket

  private _socketOptions: Partial<ManagerOptions> = {
    // ['connect timeout']: 5000,
    timeout: 5000,
    transports: ['websocket'],
  }

  private _uri: string

  private _userId: string

  public constructor(host: string, userId: string) {
    super()

    this._uri = `${host}?userId=${userId}`
    this._userId = userId
    this.isConnecting = false
    this.isConnected = false
    this._socket = null
    this._roomId = ''
    this._chats = []

    debug(`SocketClient. userId: ${userId}, uri: ${this._uri}`)
  }

  //#region public get/set
  public get hasRoom(): boolean {
    return !!this._roomId
  }

  public get roomId(): string {
    return this._roomId
  }

  public get chats(): string[] {
    return this._chats
  }

  public get userId(): string {
    return this._userId
  }

  //#endregion public get/set

  public connect(): Promise<void> {
    return new Promise<void>((resolve, err) => {
      if (!this.isConnected && !this.isConnecting) {
        debug('connect')

        const manager = new Manager(this._uri, this._socketOptions)
        this._socket = manager.socket('/')
        this.assertIsDefined(this._socket)
        this.isConnecting = true

        // standard events
        this._socket.on('connect', this._onConnect)
        this._socket.on('connect_error', this._onError)
        this._socket.on('connect_timeout', this._onError)
        this._socket.on('broadcast', this._onBroadcast)
        this._socket.on('disconnect', this._onDisconnect)
        this._socket.on('error', this._onError)

        // room events
        this._socket.on('respondJoinRoom', this._onRespondJoinRoom)
        this._socket.on('respondCreateRoom', this._onRespondCreateRoom)
        this._socket.on('respondLeaveRoom', this._onRespondLeaveRoom)
        this._socket.on('respondGetRoom', this._onRespondGetRoom)
        this._socket.on('respondChatInRoom', this._onRespondChatInRoom)
        this._socket.on('respondMessageInRoom', this._onRespondMessageInRoom)

        this.once('connect', resolve)
        this.once('error', err)
        return
      }

      resolve()
    })
  }

  public disconnect(): void {
    if (this.isConnecting || this.isConnected) {
      debug('disconnect')

      if (this._socket) {
        this.assertIsDefined(this._socket)
        //@ts-expect-error removeAllListeners is missing in the type definition
        this._socket.removeAllListeners()
        this._socket.disconnect()
        this._socket = null
      }

      this._roomId = ''
      this.isConnecting = false
      this.isConnected = false
      this.emit('disconnect')
    }
  }

  //#region public methods

  // eslint-disable-next-line @typescript-eslint/member-ordering
  public chatInRoom(message: string): Promise<void> {
    return new Promise<void>((resolve) => {
      if (this.hasRoom) {
        if (this._socket) {
          debug('chatInRoom', message)
          this._socket.emit('chatInRoom', message)
          this._socket.once('respondChatInRoom', resolve)
          return
        }
      }
      resolve()
    })
  }

  public createRoom(): Promise<void> {
    return new Promise<void>((resolve) => {
      if (this._socket) {
        if (!this.hasRoom) {
          debug('createRoom')
          this._socket.emit('createRoom')
          this._socket.once('respondCreateRoom', resolve)
          return
        }
      }

      resolve()
    })
  }

  public getRoom() {
    return new Promise<void>((resolve) => {
      if (this._socket) {
        debug('getRoom')
        this._socket.emit('getRoom')
        this._socket.once('respondGetRoom', resolve)
        return
      }

      resolve()
    })
  }

  public joinRoom(roomId: string): Promise<void> {
    return new Promise<void>((resolve) => {
      if (!this.hasRoom) {
        if (this._socket) {
          debug('joinRoom')
          this._socket.emit('joinRoom', roomId)
          this._socket.once('respondJoinRoom', resolve)
          return
        }
      }
      resolve()
    })
  }

  public leaveRoom(): Promise<void> {
    return new Promise<void>((resolve) => {
      if (this.hasRoom) {
        if (this._socket) {
          debug('leaveRoom')
          this._socket.emit('leaveRoom')
          this._socket.once('respondLeaveRoom', resolve)
          return
        }
      }
      resolve()
    })
  }

  //#endregion public methods

  //#region private methods
  //#region standard events
  private assertIsDefined<T>(val: T): asserts val is NonNullable<T> {
    if (val === undefined || val === null) {
      throw new AssertionError({
        message: `Expected 'val' to be defined, but received ${String(val)}`,
      })
    }
  }

  private _onConnect = (): void => {
    debug('_onConnect')

    this.isConnecting = false
    this.isConnected = true
    this.emit('connect')
  }

  private _onBroadcast = (respond: IRespond): void => {
    debug('received broadcast message', respond, this._userId)
  }

  private _onDisconnect = (): void => {
    debug('_onDisconnect')

    this.disconnect()
  }

  private _onError = (err: Error): void => {
    debug(`error: ${err.message}`)

    this.emit('error', err)
    this.disconnect()
  }
  //#endregion standard events

  //#region  room events

  private _onRespondCreateRoom = (respond: IRespond): void => {
    debug('_onRespondCreateRoom', respond)

    if (respond.isSuccess) {
      this._roomId = respond.roomId
    }
  }

  private _onRespondLeaveRoom = (respond: IRespond): void => {
    debug('_onRespondLeaveRoom', respond)

    if (respond.isSuccess) {
      this._roomId = ''
    }
  }

  private _onRespondGetRoom = (respond: IRespond): void => {
    debug('_onRespondGetRoom', respond)

    if (respond.isSuccess) {
      this._roomId = respond.roomId
    } else {
      this._roomId = ''
    }
  }

  private _onRespondJoinRoom = (respond: IRespond): void => {
    debug('_onRespondJoinRoom', respond)

    if (respond.isSuccess) {
      this._roomId = respond.roomId
    }
  }

  private _onRespondChatInRoom = (respond: IRespond): void => {
    debug('_onRespondChatInRoom', respond)

    if (respond.isSuccess) {
      // do nothing
    }
  }

  private _onRespondMessageInRoom = (respond: IRespond): void => {
    debug('_onRespondMessageInRoom', respond)

    if (respond.isSuccess) {
      // do nothing
      this.emit('respondMessageInRoom', respond.message)
      this._chats.push(respond.message)
    }
  }

  //#endregion
}
