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

  /**
   * Fired upon a connection error
   */
  CONNECT_ERROR = 'connect_error',

  /**
   * Fired upon a connection timeout
   */
  CONNECT_TIMEOUT = 'connect_timeout',

  /**
   * Fired upon an attempt to reconnect
   */
  RECONNECT_ATTEMPT = 'reconnect_attempt',

  /**
   * Fired upon a reconnection attempt error
   */
  RECONNECT_ERROR = 'reconnect_error',

  /**
   * Fired when the client couldn’t reconnect within reconnectionAttempts
   */
  RECONNECT_FAILED = 'reconnect_failed',

  /**
   * Alias for “reconnect_attempt”
   */
  RECONNECTING = 'reconnecting',

  /**
   * Fired upon a successful reconnection
   */
  RECONNECT = 'reconnect',

  /**
   * Fired when a `ping` is sent to the server
   */
  PING = 'ping',

  /**
   * Fired when a `pong` is received from the server
   */
  PONG = 'pong',

  NEW_LISTENER = 'newListener',

  REMOVE_LISTENER = 'removeListener',

  //#endregion SYSTEM RESERVED EVENTS

  HEARTBEAT = 'heartbeat',

  HELLO = 'hello',

  PLAYER_JOINED = 'player_joined',
  PLAYER_LEFT = 'player_left',
  INITIALIZE = 'initialize',
  NAME_UPDATE = 'name_update',
  NAME_CHANGED = 'name_changed',
  LOBBY_PLAYER_JOINED = 'lobby_player_joined',
  LOBBY_PLAYER_LEFT = 'lobby_player_left',
  MATCH_MAKING = 'match_making',
  NEW_MATCH = 'new_match',
  MATCH_MOVE = 'match_move',
  MATCH_NEW_STATE = 'match_new_state',
}

type ISODataString = string

export interface IEvents extends Record<ISocketEvent, unknown> {
  //#region SYSTEM RESERVED EVENTS
  [SocketEvent.CONNECT]: void
  [SocketEvent.CONNECTION]: void
  [SocketEvent.DISCONNECT]:
    | 'transport error'
    | 'server namespace disconnect'
    | 'client namespace disconnect'
    | 'ping timeout'
    | 'transport close'
  [SocketEvent.DISCONNECTING]: string
  [SocketEvent.CONNECT_ERROR]: void
  [SocketEvent.CONNECT_TIMEOUT]: void
  [SocketEvent.RECONNECT_ATTEMPT]: void
  [SocketEvent.RECONNECT_ERROR]: void
  [SocketEvent.RECONNECT_FAILED]: void
  [SocketEvent.RECONNECTING]: void
  [SocketEvent.RECONNECT]: void
  [SocketEvent.PING]: void
  [SocketEvent.PONG]: void
  [SocketEvent.NEW_LISTENER]: void
  [SocketEvent.REMOVE_LISTENER]: void
  //#endregion SYSTEM RESERVED EVENTS
  [SocketEvent.HEARTBEAT]: HeartbeatAction
  [SocketEvent.HELLO]: HelloAction
  [SocketEvent.PLAYER_JOINED]: PlayerJoinedAction
  [SocketEvent.INITIALIZE]: InitializeAction
  [SocketEvent.PLAYER_LEFT]: PlayerLeftAction
  [SocketEvent.NAME_UPDATE]: UpdateNameAction
  [SocketEvent.NAME_CHANGED]: PlayerNameChangedAction
  [SocketEvent.LOBBY_PLAYER_JOINED]: LobbyPlayerJoinedAction
  [SocketEvent.LOBBY_PLAYER_LEFT]: LobbyPlayerLeftAction
  [SocketEvent.MATCH_MAKING]: MatchMakingAction
  [SocketEvent.NEW_MATCH]: MatchNewMatchAction
  [SocketEvent.MATCH_MOVE]: MatchMoveAction
  [SocketEvent.MATCH_NEW_STATE]: MatchNewStateAction
}

interface ActionBase<Type extends string> {
  type: Type
}

interface ActionWithPayload<Type extends string, Payload>
  extends ActionBase<Type> {
  payload: Payload
}

type Action<Type extends string, Payload = unknown> = Payload extends unknown
  ? ActionBase<Type>
  : ActionWithPayload<Type, Payload>

type HelloAction = Action<SocketEvent.HELLO, 'world!'>
type HeartbeatAction = Action<SocketEvent.HEARTBEAT, ISODataString>

/**
 * this event is emitted by the server to all the connected clients
 * it signal that a new player has joined
 * SERVER --> --> CLIENTS
 * event: SocketEvent.PLAYER_JOINED
 * payload: PlayerSerialized
 */
type PlayerJoinedAction = Action<SocketEvent.PLAYER_JOINED, PlayerSerialized>

/**
 * this event is fired by the server to a single socket after it has established a connection
 * it provides the players state
 * SERVER --> CLIENT
 * event: SocketEvent.INITIALIZE
 * payload: PlayerSerialized[]
 */
type InitializeAction = Action<SocketEvent.INITIALIZE, PlayerSerialized[]>

/**
 * this event is emitted by the server to all the connected clients
 * it signal that a player haS left
 * SERVER --> --> CLIENTS
 * event: SocketEvent.PLAYER_LEFT
 * payload: PlayerSerialized
 */
type PlayerLeftAction = Action<SocketEvent.PLAYER_LEFT, PlayerSerialized>

/**
 * this event is fired by the client to notify to the server a player name change
 * CLIENT --> SERVER
 * event: SocketEvent.name_update
 * payload: PlayerSerialized
 */
type UpdateNameAction = Action<SocketEvent.NAME_UPDATE, PlayerSerialized>

/**
 * this event is emitted by the server to all the connected clients
 * it signal that a player name has changed
 * SERVER --> --> CLIENTS
 * event: SocketEvent.name_changed
 * payload: PlayerSerialized
 */
type PlayerNameChangedAction = Action<
  SocketEvent.NAME_CHANGED,
  PlayerSerialized
>

/**
 * this event is emitted by the server to all the connected clients
 * it signal that a player has joined the lobby
 * SERVER --> --> CLIENTS
 * event: SocketEvent.LOBBY_PLAYER_JOINED
 * payload: PlayerSerialized
 */
type LobbyPlayerJoinedAction = Action<
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
type LobbyPlayerLeftAction = Action<
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
type MatchMakingAction = Action<SocketEvent.MATCH_MAKING, PlayerSerialized>

/**
 * this event is emitted by the server to a game (id) room
 * it carries the initial match state
 * SERVER - - -> CLIENT 1
 *        - - -> CLIENT 2
 * event: SocketEvent.NEW_MATCH
 * payload: IMatchStateSerialized
 */
type MatchNewMatchAction = Action<SocketEvent.NEW_MATCH, IMatchStateSerialized>

/**
 * this event is fired by the client to notify the server of a game move ( -1 | 0 | 1)
 * CLIENT --> SERVER
 * event: SocketEvent.MATCH_MOVE
 * payload: IAction
 */
type MatchMoveAction = Action<SocketEvent.MATCH_MOVE, IAction>

/**
 * this event is emitted by the server to a game (id) room
 * it carries the new match state
 * SERVER - - -> CLIENT 1
 *        - - -> CLIENT 2
 * event: SocketEvent.MATCH_NEW_STATE
 * payload: IMatchStateSerialized
 */
type MatchNewStateAction = Action<
  SocketEvent.MATCH_NEW_STATE,
  IMatchStateSerialized
>