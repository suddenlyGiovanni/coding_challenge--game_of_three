import type { IAction, IMatchEntity } from './domain/match'
import type { IPlayerEntity, PlayerID } from './domain/player'
import type { IServerState } from './domain/server'
import type { IEventPayload } from './event-payload'

import { SocketEvent } from './events'

export interface EventPayloadCreator {
  <
    Type extends string,
    Payload = never,
    Meta = never,
    Error extends boolean = never
  >(
    type: Type,
    payload?: Payload,
    meta?: Meta,
    error?: Error
  ): IEventPayload<Type, Payload, Meta, Error>
}

const eventPayloadCreator: EventPayloadCreator = (
  type,
  payload,
  meta,
  error
) => {
  return {
    type,
    ...(payload && { payload }),
    ...(meta && { meta }),
    ...(error && { error }),
  } as const
}

type ISODataString = string

export const eventMatchNewState = (matchState: IMatchEntity) =>
  eventPayloadCreator(SocketEvent.MATCH_NEW_STATE, matchState)

export const eventHello = (payload: 'world!') =>
  eventPayloadCreator(SocketEvent.SYSTEM_HELLO, payload)
export type IEventHello = ReturnType<typeof eventHello>

export const eventHeartbeat = (payload: ISODataString) =>
  eventPayloadCreator(SocketEvent.SYSTEM_HEARTBEAT, payload)
export type IEventHeartbeat = ReturnType<typeof eventHeartbeat>

export const eventPlayerJoined = (playerSerialized: IPlayerEntity) =>
  eventPayloadCreator(SocketEvent.SYSTEM_PLAYER_JOINED, playerSerialized)
/**
 * this event is emitted by the server to all the connected clients
 * it signal that a new player has joined
 * SERVER --> --> CLIENTS
 * event: SocketEvent.PLAYER_JOINED
 * payload: PlayerSerialized
 */
export type IEventPlayerJoined = ReturnType<typeof eventPlayerJoined>

export const eventInitialize = (serverState: IServerState) =>
  eventPayloadCreator(SocketEvent.SYSTEM_INITIALIZE, serverState)
/**
 * this event is fired by the server to a single socket after it has established a connection
 * it provides the players state
 * SERVER --> CLIENT
 * event: SocketEvent.INITIALIZE
 * payload: ServerState
 */
export type IEventInitialize = ReturnType<typeof eventInitialize>

export const eventPlayerLeft = (playerSerialized: IPlayerEntity) =>
  eventPayloadCreator(SocketEvent.SYSTEM_PLAYER_LEFT, playerSerialized)
/**
 * this event is emitted by the server to all the connected clients
 * it signal that a player haS left
 * SERVER --> --> CLIENTS
 * event: SocketEvent.PLAYER_LEFT
 * payload: PlayerSerialized
 */
export type IEventPlayerLeft = ReturnType<typeof eventPlayerLeft>

export const eventUpdateName = (name: string) =>
  eventPayloadCreator(SocketEvent.SYSTEM_NAME_UPDATE, name)
/**
 * this event is fired by the client to notify to the server a player name change
 * CLIENT --> SERVER
 * event: SocketEvent.name_update
 * payload: PlayerSerialized
 */
export type IEventUpdateName = ReturnType<typeof eventUpdateName>

export const eventPlayerNameChanged = (playerSerialized: IPlayerEntity) =>
  eventPayloadCreator(SocketEvent.SYSTEM_NAME_CHANGED, playerSerialized)
/**
 * this event is emitted by the server to all the connected clients
 * it signal that a player name has changed
 * SERVER --> --> CLIENTS
 * event: SocketEvent.name_changed
 * payload: PlayerSerialized
 */
export type IEventPlayerNameChanged = ReturnType<typeof eventPlayerNameChanged>

export const eventLobbyPlayerJoined = (playerID: PlayerID) =>
  eventPayloadCreator(SocketEvent.LOBBY_PLAYER_JOINED, playerID)
/**
 * this event is emitted by the server to all the connected clients
 * it signal that a player has joined the lobby
 * SERVER --> --> CLIENTS
 * event: SocketEvent.LOBBY_PLAYER_JOINED
 * payload: PlayerID
 */
export type IEventLobbyPlayerJoined = ReturnType<typeof eventLobbyPlayerJoined>

export const eventLobbyPlayerLeft = (playerID: PlayerID) =>
  eventPayloadCreator(SocketEvent.LOBBY_PLAYER_LEFT, playerID)

/**
 * this event is emitted by the server to all the connected clients
 * it signal that a player has left the lobby
 * SERVER --> --> CLIENTS
 * event: SocketEvent.LOBBY_PLAYER_LEFT
 * payload: PlayerID
 */
export type IEventLobbyPlayerLeft = ReturnType<typeof eventLobbyPlayerLeft>

export const eventMatchMaking = () =>
  eventPayloadCreator(SocketEvent.LOBBY_MAKE_MATCH)
/**
 * this event is fired by the client to notify to the server that the client wants to start a new
 * match
 * CLIENT --> SERVER
 * event: SocketEvent.MATCH_MAKING
 * payload: void
 */
export type IEventMatchMaking = ReturnType<typeof eventMatchMaking>

export const eventMatchNewMatch = (matchState: IMatchEntity) =>
  eventPayloadCreator(SocketEvent.MATCH_NEW_MATCH, matchState)
/**
 * this event is emitted by the server to a game (id) room
 * it carries the initial match state
 * SERVER - - -> CLIENT 1
 *        - - -> CLIENT 2
 * event: SocketEvent.NEW_MATCH
 * payload: IMatchStateSerialized
 */
export type ActionMatchNewMatch = ReturnType<typeof eventMatchNewMatch>

export const eventMatchMove = (action: IAction) =>
  eventPayloadCreator(SocketEvent.MATCH_MOVE, action)
/**
 * this event is fired by the client to notify the server of a game move ( -1 | 0 | 1)
 * CLIENT --> SERVER
 * event: SocketEvent.MATCH_MOVE
 * payload: IAction
 */
export type IEventMatchMove = ReturnType<typeof eventMatchMove>

export const eventMatchMoveError = (errorMessage: string) =>
  eventPayloadCreator(
    SocketEvent.MATCH_MOVE_ERROR,
    errorMessage,
    undefined,
    true
  )
export type IEventMatchMoveError = ReturnType<typeof eventMatchMoveError>

/**
 * this event is emitted by the server to a game (id) room
 * it carries the new match state
 * SERVER - - -> CLIENT 1
 *        - - -> CLIENT 2
 * event: SocketEvent.MATCH_NEW_STATE
 * payload: IMatchStateSerialized
 */
export type IEventMatchNewState = ReturnType<typeof eventMatchNewState>
