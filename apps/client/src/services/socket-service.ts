/* eslint-disable @typescript-eslint/no-explicit-any */
import { Observable, fromEvent } from 'rxjs'
import { Manager, ManagerOptions, Socket } from 'socket.io-client'

import {
  IAction,
  IEventPayload,
  IEvents,
  IMatchEntity,
  IPlayerEntity,
  IServerState,
  SocketEvent,
  eventHello,
  eventMatchMaking,
  eventMatchMove,
  eventUpdateName,
} from '@game-of-three/contracts'

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

  public onLobbyPlayerJoined = (): Observable<
    IEventPayload<SocketEvent.LOBBY_PLAYER_JOINED, string>
  > => {
    return fromEvent<IEvents[SocketEvent.LOBBY_PLAYER_JOINED]>(
      this.socket,
      SocketEvent.LOBBY_PLAYER_JOINED
    )
  }

  public onLobbyPlayerLeft = (): Observable<
    IEventPayload<SocketEvent.LOBBY_PLAYER_LEFT, string>
  > => {
    return fromEvent<IEvents[SocketEvent.LOBBY_PLAYER_LEFT]>(
      this.socket,
      SocketEvent.LOBBY_PLAYER_LEFT
    )
  }

  public onMatchEnded = (): Observable<void> => {
    return fromEvent<IEvents[SocketEvent.MATCH_END_STATE]>(
      this.socket,
      SocketEvent.MATCH_END_STATE
    )
  }

  public onMatchError = (): Observable<
    IEventPayload<SocketEvent.MATCH_MOVE_ERROR, string, any, true>
  > => {
    return fromEvent<IEvents[SocketEvent.MATCH_MOVE_ERROR]>(
      this.socket,
      SocketEvent.MATCH_MOVE_ERROR
    )
  }

  public onMatchNewState = (): Observable<
    IEventPayload<
      SocketEvent.MATCH_NEW_STATE,
      IMatchEntity<string, string, string>
    >
  > => {
    return fromEvent<IEvents[SocketEvent.MATCH_NEW_STATE]>(
      this.socket,
      SocketEvent.MATCH_NEW_STATE
    )
  }

  public onSystemHeartbeat = (): Observable<
    IEventPayload<SocketEvent.SYSTEM_HEARTBEAT, string>
  > => {
    return fromEvent<IEvents[SocketEvent.SYSTEM_HEARTBEAT]>(
      this.socket,
      SocketEvent.SYSTEM_HEARTBEAT
    )
  }

  public onSystemInitialize = (): Observable<
    IEventPayload<SocketEvent.SYSTEM_INITIALIZE, IServerState>
  > => {
    return fromEvent<IEvents[SocketEvent.SYSTEM_INITIALIZE]>(
      this.socket,
      SocketEvent.SYSTEM_INITIALIZE
    )
  }

  public onSystemPlayerJoined = (): Observable<
    IEventPayload<SocketEvent.SYSTEM_PLAYER_JOINED, IPlayerEntity>
  > => {
    return fromEvent<IEvents[SocketEvent.SYSTEM_PLAYER_JOINED]>(
      this.socket,
      SocketEvent.SYSTEM_PLAYER_JOINED
    )
  }

  public onSystemPlayerLeft = (): Observable<
    IEventPayload<SocketEvent.SYSTEM_PLAYER_LEFT, IPlayerEntity>
  > => {
    return fromEvent<IEvents[SocketEvent.SYSTEM_PLAYER_LEFT]>(
      this.socket,
      SocketEvent.SYSTEM_PLAYER_LEFT
    )
  }

  public onSystemPlayerUpdated = (): Observable<
    IEventPayload<SocketEvent.SYSTEM_NAME_CHANGED, IPlayerEntity<string>>
  > => {
    return fromEvent<IEvents[SocketEvent.SYSTEM_NAME_CHANGED]>(
      this.socket,
      SocketEvent.SYSTEM_NAME_CHANGED
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
