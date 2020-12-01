import { Manager, ManagerOptions, Socket } from 'socket.io-client'

import { Action, IEvents, SocketEvent } from '@game-of-three/contracts'

interface ListenerCallback<Action> {
  (action: Action): void
}

export interface DataSocket<Event extends keyof IEvents> {
  emit: <Data extends IEvents[Event]>(
    data: Data extends Action<Event, unknown> ? Data['payload'] : Data
  ) => void
  off: (callback?: ListenerCallback<IEvents[Event]>) => void
  on: (callback: ListenerCallback<IEvents[Event]>) => void
}

export class SocketService {
  public connection: DataSocket<SocketEvent.INTERNAL_CONNECT>

  public disconnection: DataSocket<SocketEvent.INTERNAL_DISCONNECT>

  public heartbeat: DataSocket<SocketEvent.SYSTEM_HEARTBEAT>

  public hello: DataSocket<SocketEvent.SYSTEM_HELLO>

  public initialize: DataSocket<SocketEvent.SYSTEM_INITIALIZE>

  public makeMatch: DataSocket<SocketEvent.LOBBY_MAKE_MATCH>

  public matchEnded: DataSocket<SocketEvent.MATCH_END_STATE>

  public matchError: DataSocket<SocketEvent.MATCH_MOVE_ERROR>

  public matchMove: DataSocket<SocketEvent.MATCH_MOVE>

  public nameChanged: DataSocket<SocketEvent.SYSTEM_NAME_CHANGED>

  public newMatch: DataSocket<SocketEvent.MATCH_NEW_MATCH>

  public newMatchState: DataSocket<SocketEvent.MATCH_NEW_STATE>

  public playerJoined: DataSocket<SocketEvent.SYSTEM_PLAYER_JOINED>

  public playerJoinedLobby: DataSocket<SocketEvent.LOBBY_PLAYER_JOINED>

  public playerLeft: DataSocket<SocketEvent.SYSTEM_PLAYER_LEFT>

  public playerLeftLobby: DataSocket<SocketEvent.LOBBY_PLAYER_LEFT>

  public updateName!: DataSocket<SocketEvent.SYSTEM_NAME_UPDATE>

  private readonly _opts?: Partial<ManagerOptions>

  private readonly _uri: string

  private socket: Socket

  public constructor(uri: string, opts?: Partial<ManagerOptions>) {
    this._uri = uri
    this._opts = opts
  }

  public createSocket = <Event extends keyof IEvents>(
    event: Event
  ): DataSocket<Event> => {
    return {
      emit: this.emitCallback(event),
      off: this.offCallback(event),
      on: this.onCallback(event),
    }
  }

  public disconnect(): void {
    this.socket.disconnect()
  }

  public init(): SocketService {
    console.log(`initiating socket service on port ${this._uri}`)
    const manager = new Manager(this._uri, this._opts)
    this.socket = manager.socket('/')

    this.connection = this.createSocket(SocketEvent.INTERNAL_CONNECT)

    this.disconnection = this.createSocket(SocketEvent.INTERNAL_DISCONNECT)

    this.heartbeat = this.createSocket(SocketEvent.SYSTEM_HEARTBEAT)

    this.hello = this.createSocket(SocketEvent.SYSTEM_HELLO)

    this.initialize = this.createSocket(SocketEvent.SYSTEM_INITIALIZE)

    this.makeMatch = this.createSocket(SocketEvent.LOBBY_MAKE_MATCH)

    this.matchEnded = this.createSocket(SocketEvent.MATCH_END_STATE)

    this.matchError = this.createSocket(SocketEvent.MATCH_MOVE_ERROR)

    this.matchMove = this.createSocket(SocketEvent.MATCH_MOVE)

    this.nameChanged = this.createSocket(SocketEvent.SYSTEM_NAME_CHANGED)

    this.newMatch = this.createSocket(SocketEvent.MATCH_NEW_MATCH)

    this.newMatchState = this.createSocket(SocketEvent.MATCH_NEW_STATE)

    this.playerJoined = this.createSocket(SocketEvent.SYSTEM_PLAYER_JOINED)

    this.playerJoinedLobby = this.createSocket(SocketEvent.LOBBY_PLAYER_JOINED)

    this.playerLeft = this.createSocket(SocketEvent.SYSTEM_PLAYER_LEFT)

    this.playerLeftLobby = this.createSocket(SocketEvent.LOBBY_PLAYER_LEFT)

    this.updateName = this.createSocket(SocketEvent.SYSTEM_NAME_UPDATE)

    return this
  }

  private emitCallback = <Event extends keyof IEvents, Data>(event: Event) => {
    return (data: Data): void => {
      const action: Action<Event, Data> = {
        payload: data,
        type: event,
      }
      this.socket.emit(event, action)
    }
  }

  private offCallback = <Event extends keyof IEvents, Action>(event: Event) => {
    return (callback?: ListenerCallback<Action>): void => {
      this.socket.off(event, callback)
    }
  }

  private onCallback = <Event extends keyof IEvents, Action>(event: Event) => {
    return (callback: ListenerCallback<Action>): void => {
      this.socket.on(event, callback)
    }
  }
}
