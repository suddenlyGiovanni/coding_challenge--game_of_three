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

// interface ListenerCallback<Action> {
//   (action: Action): void
// }

// export interface DataSocket<Event extends keyof IEvents> {
//   emit: <Data extends IEvents[Event]>(
//     data: Data extends EventPayload<Event, unknown> ? Data['payload'] : Data
//   ) => void
//   off: (callback?: ListenerCallback<IEvents[Event]>) => void
//   on: (callback: ListenerCallback<IEvents[Event]>) => void
// }

export class SocketService {
  private readonly _opts?: Partial<ManagerOptions>

  private readonly _uri: string

  private socket: Socket

  public constructor(uri: string, opts?: Partial<ManagerOptions>) {
    this._uri = uri
    this._opts = opts
  }

  // public createSocket = <Event extends keyof IEvents>(
  //   event: Event
  // ): DataSocket<Event> => {
  //   return {
  //     emit: this.emitCallback(event),
  //     off: this.offCallback(event),
  //     on: this.onCallback(event),
  //   }
  // }

  public disconnect(): void {
    this.socket.disconnect()
  }

  public emitHello = (payload: 'world!'): void => {
    this.emit(SocketEvent.SYSTEM_HELLO, eventHello(payload))
  }

  public emitMakeMatch = (): void => {
    this.emit(SocketEvent.LOBBY_MAKE_MATCH, eventMatchMaking())
  }

  public emitMatchMove = (action: IAction): void => {
    this.emit(SocketEvent.MATCH_MOVE, eventMatchMove(action))
  }

  public emitNameUpdated = (name: string): void => {
    this.emit(SocketEvent.SYSTEM_NAME_UPDATE, eventUpdateName(name))
  }

  public init(): this {
    console.log(`initiating socket service on port ${this._uri}`)
    const manager = new Manager(this._uri, this._opts)
    this.socket = manager.socket('/')
    return this
  }

  public onConnection = (): Observable<void> => {
    return fromEvent<IEvents[SocketEvent.INTERNAL_CONNECTION]>(
      this.socket,
      SocketEvent.INTERNAL_CONNECT
    )
  }

  public onDisconnection = (): Observable<
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

  public onHeartbeat = (): Observable<
    IEventPayload<SocketEvent.SYSTEM_HEARTBEAT, string>
  > => {
    return fromEvent<IEvents[SocketEvent.SYSTEM_HEARTBEAT]>(
      this.socket,
      SocketEvent.SYSTEM_HEARTBEAT
    )
  }

  public onInitialize = (): Observable<
    IEventPayload<SocketEvent.SYSTEM_INITIALIZE, IServerState>
  > => {
    return fromEvent<IEvents[SocketEvent.SYSTEM_INITIALIZE]>(
      this.socket,
      SocketEvent.SYSTEM_INITIALIZE
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

  public onNameChanged = (): Observable<
    IEventPayload<SocketEvent.SYSTEM_NAME_CHANGED, IPlayerEntity<string>>
  > => {
    return fromEvent<IEvents[SocketEvent.SYSTEM_NAME_CHANGED]>(
      this.socket,
      SocketEvent.SYSTEM_NAME_CHANGED
    )
  }

  public onNewMatchState = (): Observable<
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

  public onPlayerJoined = (): Observable<
    IEventPayload<SocketEvent.SYSTEM_PLAYER_JOINED, IPlayerEntity>
  > => {
    return fromEvent<IEvents[SocketEvent.SYSTEM_PLAYER_JOINED]>(
      this.socket,
      SocketEvent.SYSTEM_PLAYER_JOINED
    )
  }

  public onPlayerJoinedLobby = (): Observable<
    IEventPayload<SocketEvent.LOBBY_PLAYER_JOINED, string>
  > => {
    return fromEvent<IEvents[SocketEvent.LOBBY_PLAYER_JOINED]>(
      this.socket,
      SocketEvent.LOBBY_PLAYER_JOINED
    )
  }

  public onPlayerLeft = (): Observable<
    IEventPayload<SocketEvent.SYSTEM_PLAYER_LEFT, IPlayerEntity>
  > => {
    return fromEvent<IEvents[SocketEvent.SYSTEM_PLAYER_LEFT]>(
      this.socket,
      SocketEvent.SYSTEM_PLAYER_LEFT
    )
  }

  public onPlayerLeftLobby = (): Observable<
    IEventPayload<SocketEvent.LOBBY_PLAYER_LEFT, string>
  > => {
    return fromEvent<IEvents[SocketEvent.LOBBY_PLAYER_LEFT]>(
      this.socket,
      SocketEvent.LOBBY_PLAYER_LEFT
    )
  }

  private emit<Event extends keyof IEvents>(
    event: Event,
    action: IEvents[Event]
  ): void {
    this.socket.emit(event, action)
  }

  // private emitCallback = <Event extends keyof IEvents, Data>(event: Event) => {
  //   return (data: Data): void => {
  //     const action: Action<Event, Data> = {
  //       payload: data,
  //       type: event,
  //     }
  //     this.socket.emit(event, action)
  //   }
  // }

  // private offCallback = <Event extends keyof IEvents, Action>(event: Event) => {
  //   return (callback?: ListenerCallback<Action>): void => {
  //     this.socket.off(event, callback)
  //   }
  // }

  // private onCallback = <Event extends keyof IEvents, Action>(event: Event) => {
  //   return (callback: ListenerCallback<Action>): void => {
  //     this.socket.on(event, callback)
  //   }
  // }
}

const socketService = new SocketService('ws://localhost:3000')
socketService.init()

export { socketService }
