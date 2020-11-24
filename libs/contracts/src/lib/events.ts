import type { IAction, IMatchStateSerialized } from './match'
import type { PlayerSerialized } from './player'

/* eslint-disable @typescript-eslint/member-ordering */
export type ISocketEvent =
  //#region  SYSTEM RESERVED EVENTS
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
  | 'heartbeat'
  | 'hello'
  | 'player_joined'
  | 'player_left'
  | 'initialize'
  | 'name_update'
  | 'name_changed'
  | 'lobby_player_joined'
  | 'lobby_player_left'
  | 'match_making'
  | 'new_match'
  | 'match_move'
  | 'match_new_state'
//#endregion

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

  SYSTEM_HEARTBEAT = 'heartbeat',

  SYSTEM_HELLO = 'hello',

  SYSTEM_PLAYER_JOINED = 'player_joined',
  SYSTEM_PLAYER_LEFT = 'player_left',
  SYSTEM_INITIALIZE = 'initialize',
  SYSTEM_NAME_UPDATE = 'name_update',
  SYSTEM_NAME_CHANGED = 'name_changed',
  LOBBY_PLAYER_JOINED = 'lobby_player_joined',
  LOBBY_PLAYER_LEFT = 'lobby_player_left',
  LOBBY_MAKE_MATCH = 'match_making',
  MATCH_NEW_MATCH = 'new_match',
  MATCH_MOVE = 'match_move',
  MATCH_NEW_STATE = 'match_new_state',
}

type ISODataString = string

export interface IEvents
  extends Record<ISocketEvent, Action<ISocketEvent, unknown> | string | void> {
  //#region SYSTEM RESERVED EVENTS
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
  //#endregion SYSTEM RESERVED EVENTS
  [SocketEvent.SYSTEM_HEARTBEAT]: ActionHeartbeat
  [SocketEvent.SYSTEM_HELLO]: ActionHello
  [SocketEvent.SYSTEM_PLAYER_JOINED]: ActionPlayerJoined
  [SocketEvent.SYSTEM_INITIALIZE]: ActionInitialize
  [SocketEvent.SYSTEM_PLAYER_LEFT]: ActionPlayerLeft
  [SocketEvent.SYSTEM_NAME_UPDATE]: ActionUpdateName
  [SocketEvent.SYSTEM_NAME_CHANGED]: ActionPlayerNameChanged
  [SocketEvent.LOBBY_PLAYER_JOINED]: ActionLobbyPlayerJoined
  [SocketEvent.LOBBY_PLAYER_LEFT]: ActionLobbyPlayerLeft
  [SocketEvent.LOBBY_MAKE_MATCH]: ActionMatchMaking
  [SocketEvent.MATCH_NEW_MATCH]: ActionMatchNewMatch
  [SocketEvent.MATCH_MOVE]: ActionMatchMove
  [SocketEvent.MATCH_NEW_STATE]: ActionMatchNewState
}

interface ActionBase<Type extends string> {
  type: Type
}

export interface ActionWithPayload<Type extends string, Payload>
  extends ActionBase<Type> {
  payload: Payload
}

export type Action<Type extends string, Payload> = Payload extends never
  ? ActionBase<Type>
  : ActionWithPayload<Type, Payload>

type ActionHello = Action<SocketEvent.SYSTEM_HELLO, 'world!'>
type ActionHeartbeat = Action<SocketEvent.SYSTEM_HEARTBEAT, ISODataString>

/**
 * this event is emitted by the server to all the connected clients
 * it signal that a new player has joined
 * SERVER --> --> CLIENTS
 * event: SocketEvent.PLAYER_JOINED
 * payload: PlayerSerialized
 */
type ActionPlayerJoined = Action<
  SocketEvent.SYSTEM_PLAYER_JOINED,
  PlayerSerialized
>

/**
 * this event is fired by the server to a single socket after it has established a connection
 * it provides the players state
 * SERVER --> CLIENT
 * event: SocketEvent.INITIALIZE
 * payload: PlayerSerialized[]
 */
type ActionInitialize = Action<
  SocketEvent.SYSTEM_INITIALIZE,
  PlayerSerialized[]
>

/**
 * this event is emitted by the server to all the connected clients
 * it signal that a player haS left
 * SERVER --> --> CLIENTS
 * event: SocketEvent.PLAYER_LEFT
 * payload: PlayerSerialized
 */
type ActionPlayerLeft = Action<SocketEvent.SYSTEM_PLAYER_LEFT, PlayerSerialized>

/**
 * this event is fired by the client to notify to the server a player name change
 * CLIENT --> SERVER
 * event: SocketEvent.name_update
 * payload: PlayerSerialized
 */
type ActionUpdateName = Action<SocketEvent.SYSTEM_NAME_UPDATE, string>

/**
 * this event is emitted by the server to all the connected clients
 * it signal that a player name has changed
 * SERVER --> --> CLIENTS
 * event: SocketEvent.name_changed
 * payload: PlayerSerialized
 */
type ActionPlayerNameChanged = Action<
  SocketEvent.SYSTEM_NAME_CHANGED,
  PlayerSerialized
>

/**
 * this event is emitted by the server to all the connected clients
 * it signal that a player has joined the lobby
 * SERVER --> --> CLIENTS
 * event: SocketEvent.LOBBY_PLAYER_JOINED
 * payload: PlayerSerialized
 */
type ActionLobbyPlayerJoined = Action<
  SocketEvent.LOBBY_PLAYER_JOINED,
  PlayerSerialized
>

/**
 * this event is emitted by the server to all the connected clients
 * it signal that a player has left the lobby
 * SERVER --> --> CLIENTS
 * event: SocketEvent.LOBBY_PLAYER_LEFT
 * payload: PlayerSerialized
 */
type ActionLobbyPlayerLeft = Action<
  SocketEvent.LOBBY_PLAYER_LEFT,
  PlayerSerialized
>

/**
 * this event is fired by the client to notify to the server that the client wants to start a new
 * match
 * CLIENT --> SERVER
 * event: SocketEvent.MATCH_MAKING
 * payload: PlayerSerialized
 */
type ActionMatchMaking = Action<SocketEvent.LOBBY_MAKE_MATCH, string>

/**
 * this event is emitted by the server to a game (id) room
 * it carries the initial match state
 * SERVER - - -> CLIENT 1
 *        - - -> CLIENT 2
 * event: SocketEvent.NEW_MATCH
 * payload: IMatchStateSerialized
 */
type ActionMatchNewMatch = Action<
  SocketEvent.MATCH_NEW_MATCH,
  IMatchStateSerialized
>

/**
 * this event is fired by the client to notify the server of a game move ( -1 | 0 | 1)
 * CLIENT --> SERVER
 * event: SocketEvent.MATCH_MOVE
 * payload: IAction
 */
type ActionMatchMove = Action<SocketEvent.MATCH_MOVE, IAction>

/**
 * this event is emitted by the server to a game (id) room
 * it carries the new match state
 * SERVER - - -> CLIENT 1
 *        - - -> CLIENT 2
 * event: SocketEvent.MATCH_NEW_STATE
 * payload: IMatchStateSerialized
 */
type ActionMatchNewState = Action<
  SocketEvent.MATCH_NEW_STATE,
  IMatchStateSerialized
>
