/* eslint-disable @typescript-eslint/no-explicit-any */
import { Observable, fromEvent, fromEventPattern } from 'rxjs'
import { Manager, ManagerOptions, Socket } from 'socket.io-client'

import { ToEventTupleDiscriminatedUnion } from '../utility-types'

import type {
  IAction,
  ICustomSocketEvents,
  IEvents,
} from '@game-of-three/contracts'
import {
  SocketEvent,
  assertIsAction,
  eventHello,
  eventMatchMaking,
  eventMatchMove,
  eventUpdateName,
} from '@game-of-three/contracts'

export type SocketEventsEntries = ToEventTupleDiscriminatedUnion<ICustomSocketEvents>

export class SocketService {
  private readonly _opts?: Partial<ManagerOptions>

  private readonly _uri: string

  private socket: Socket

  public constructor(uri: string, opts?: Partial<ManagerOptions>) {
    this._uri = uri
    this._opts = opts
  }

  public disconnect(): void {
    this.socket.disconnect()
  }

  public emitLobbyMakeMatch = (): void => {
    this.emit(SocketEvent.LOBBY_MAKE_MATCH, eventMatchMaking())
  }

  public emitMatchMove = (action: IAction): void => {
    assertIsAction(action)
    this.emit(SocketEvent.MATCH_MOVE, eventMatchMove(action))
  }

  public emitSystemHello = (payload: 'world!'): void => {
    this.emit(SocketEvent.SYSTEM_HELLO, eventHello(payload))
  }

  public emitSystemNameUpdated = (name: string): void => {
    this.emit(SocketEvent.SYSTEM_NAME_UPDATE, eventUpdateName(name))
  }

  public init(): this {
    console.log(`initiating socket service on port ${this._uri}`)
    const manager = new Manager(this._uri, this._opts)
    this.socket = manager.socket('/')
    return this
  }

  public onEvent = (): Observable<SocketEventsEntries> => {
    return fromEventPattern(
      (handler) => this.socket.onAny(handler),
      (handler) => this.socket.offAny(handler)
    )
  }

  public onInternalConnection = (): Observable<void> => {
    return fromEvent<IEvents[SocketEvent.INTERNAL_CONNECTION]>(
      this.socket,
      SocketEvent.INTERNAL_CONNECT
    )
  }

  public onInternalDisconnection = (): Observable<
    | 'transport error'
    | 'server namespace disconnect'
    | 'client namespace disconnect'
    | 'ping timeout'
    | 'transport close'
  > => {
    return fromEvent<IEvents[SocketEvent.INTERNAL_DISCONNECT]>(
      this.socket,
      SocketEvent.INTERNAL_DISCONNECT
    )
  }

  private emit<Event extends keyof IEvents>(
    event: Event,
    action: IEvents[Event]
  ): void {
    this.socket.emit(event, action)
  }
}

const socketService: SocketService = new SocketService('ws://localhost:3000')
socketService.init()

export default socketService
