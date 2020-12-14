import type { IEventPayload } from './event-payload'
import type {
  ActionMatchNewMatch,
  IEventHeartbeat,
  IEventHello,
  IEventInitialize,
  IEventLobbyPlayerJoined,
  IEventLobbyPlayerLeft,
  IEventMatchMaking,
  IEventMatchMove,
  IEventMatchMoveError,
  IEventMatchNewState,
  IEventPlayerJoined,
  IEventPlayerLeft,
  IEventPlayerNameChanged,
  IEventUpdateName,
} from './events-creators'

/* eslint-disable @typescript-eslint/member-ordering */

//#region SYSTEM RESERVED EVENTS
type SystemSocketEvents =
  | 'connect'
  | 'connection'
  | 'disconnect'
  | 'disconnecting'
  | 'connect_error'
  | 'connect_timeout'
  | 'reconnect_attempt'
  | 'reconnect_error'
  | 'reconnect_failed'
  | 'reconnecting'
  | 'reconnect'
  | 'ping'
  | 'pong'
  | 'newListener'
  | 'removeListener'
//#endregion SYSTEM RESERVED EVENTS

//#region CUSTOM EVENTS
type CustomSocketEvents =
  | 'SYSTEM_HEARTBEAT'
  | 'SYSTEM_HELLO'
  | 'SYSTEM_PLAYER_JOINED'
  | 'SYSTEM_PLAYER_LEFT'
  | 'SYSTEM_INITIALIZE'
  | 'SYSTEM_NAME_UPDATE'
  | 'SYSTEM_NAME_CHANGED'
  | 'LOBBY_PLAYER_JOINED'
  | 'LOBBY_PLAYER_LEFT'
  | 'LOBBY_MAKE_MATCH'
  | 'MATCH_NEW_MATCH'
  | 'MATCH_MOVE'
  | 'MATCH_MOVE_ERROR'
  | 'MATCH_NEW_STATE'
  | 'MATCH_END_STATE'
//#endregion
export type ISocketEvent = SystemSocketEvents | CustomSocketEvents
export enum SocketEvent {
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
  INTERNAL_CONNECT = 'connect',
  /**
   * Synonym of Event: ‘connect’.
   */
  INTERNAL_CONNECTION = 'connection',
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
  INTERNAL_DISCONNECT = 'disconnect',

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
  INTERNAL_DISCONNECTING = 'disconnecting',

  /**
   * Fired upon a connection error
   */
  INTERNAL_CONNECT_ERROR = 'connect_error',

  /**
   * Fired upon a connection timeout
   */
  INTERNAL_CONNECT_TIMEOUT = 'connect_timeout',

  /**
   * Fired upon an attempt to reconnect
   */
  INTERNAL_RECONNECT_ATTEMPT = 'reconnect_attempt',

  /**
   * Fired upon a reconnection attempt error
   */
  INTERNAL_RECONNECT_ERROR = 'reconnect_error',

  /**
   * Fired when the client couldn’t reconnect within reconnectionAttempts
   */
  INTERNAL_RECONNECT_FAILED = 'reconnect_failed',

  /**
   * Alias for “reconnect_attempt”
   */
  INTERNAL_RECONNECTING = 'reconnecting',

  /**
   * Fired upon a successful reconnection
   */
  INTERNAL_RECONNECT = 'reconnect',

  /**
   * Fired when a `ping` is sent to the server
   */
  INTERNAL_PING = 'ping',

  /**
   * Fired when a `pong` is received from the server
   */
  INTERNAL_PONG = 'pong',

  INTERNAL_NEW_LISTENER = 'newListener',

  INTERNAL_REMOVE_LISTENER = 'removeListener',

  //#endregion SYSTEM RESERVED EVENTS
  SYSTEM_HEARTBEAT = 'SYSTEM_HEARTBEAT',

  SYSTEM_HELLO = 'SYSTEM_HELLO',

  SYSTEM_PLAYER_JOINED = 'SYSTEM_PLAYER_JOINED',
  SYSTEM_PLAYER_LEFT = 'SYSTEM_PLAYER_LEFT',
  SYSTEM_INITIALIZE = 'SYSTEM_INITIALIZE',
  SYSTEM_NAME_UPDATE = 'SYSTEM_NAME_UPDATE',
  SYSTEM_NAME_CHANGED = 'SYSTEM_NAME_CHANGED',
  LOBBY_PLAYER_JOINED = 'LOBBY_PLAYER_JOINED',
  LOBBY_PLAYER_LEFT = 'LOBBY_PLAYER_LEFT',
  LOBBY_MAKE_MATCH = 'LOBBY_MAKE_MATCH',
  MATCH_NEW_MATCH = 'MATCH_NEW_MATCH',
  MATCH_MOVE = 'MATCH_MOVE',
  MATCH_MOVE_ERROR = 'MATCH_MOVE_ERROR',
  MATCH_NEW_STATE = 'MATCH_NEW_STATE',
  MATCH_END_STATE = 'MATCH_END_STATE',
}

export interface ISystemSocketEvent
  extends Record<SystemSocketEvents, unknown> {
  [SocketEvent.INTERNAL_CONNECT]: void
  [SocketEvent.INTERNAL_CONNECTION]: void
  [SocketEvent.INTERNAL_DISCONNECT]:
    | 'transport error'
    | 'server namespace disconnect'
    | 'client namespace disconnect'
    | 'ping timeout'
    | 'transport close'
  [SocketEvent.INTERNAL_DISCONNECTING]: string
  [SocketEvent.INTERNAL_CONNECT_ERROR]: void
  [SocketEvent.INTERNAL_CONNECT_TIMEOUT]: void
  [SocketEvent.INTERNAL_RECONNECT_ATTEMPT]: void
  [SocketEvent.INTERNAL_RECONNECT_ERROR]: void
  [SocketEvent.INTERNAL_RECONNECT_FAILED]: void
  [SocketEvent.INTERNAL_RECONNECTING]: void
  [SocketEvent.INTERNAL_RECONNECT]: void
  [SocketEvent.INTERNAL_PING]: void
  [SocketEvent.INTERNAL_PONG]: void
  [SocketEvent.INTERNAL_NEW_LISTENER]: void
  [SocketEvent.INTERNAL_REMOVE_LISTENER]: void
}

export interface ICustomSocketEvents
  extends Record<
    CustomSocketEvents,
    IEventPayload<CustomSocketEvents, unknown, unknown, boolean> | void
  > {
  [SocketEvent.SYSTEM_HEARTBEAT]: IEventHeartbeat
  [SocketEvent.SYSTEM_HELLO]: IEventHello
  [SocketEvent.SYSTEM_PLAYER_JOINED]: IEventPlayerJoined
  [SocketEvent.SYSTEM_INITIALIZE]: IEventInitialize
  [SocketEvent.SYSTEM_PLAYER_LEFT]: IEventPlayerLeft
  [SocketEvent.SYSTEM_NAME_UPDATE]: IEventUpdateName
  [SocketEvent.SYSTEM_NAME_CHANGED]: IEventPlayerNameChanged
  [SocketEvent.LOBBY_PLAYER_JOINED]: IEventLobbyPlayerJoined
  [SocketEvent.LOBBY_PLAYER_LEFT]: IEventLobbyPlayerLeft
  [SocketEvent.LOBBY_MAKE_MATCH]: IEventMatchMaking
  [SocketEvent.MATCH_NEW_MATCH]: ActionMatchNewMatch
  [SocketEvent.MATCH_MOVE]: IEventMatchMove
  [SocketEvent.MATCH_MOVE_ERROR]: IEventMatchMoveError
  [SocketEvent.MATCH_NEW_STATE]: IEventMatchNewState
  [SocketEvent.MATCH_END_STATE]: void // FIXME: use an event creator
}

export interface IEvents extends ISystemSocketEvent, ICustomSocketEvents {}
