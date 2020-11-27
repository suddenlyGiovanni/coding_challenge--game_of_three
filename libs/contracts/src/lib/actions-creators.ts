import { actionCreator } from './actions'
import type { IAction, IMatchStateSerialized } from './domain/match'
import type { PlayerID, PlayerSerialized } from './domain/player'
import { SocketEvent } from './events'
import type { ServerState } from './events'

export const actionHello = (payload: 'world!') =>
  actionCreator(SocketEvent.SYSTEM_HELLO, payload)

type ISODataString = string
export const actionHeartbeat = (payload: ISODataString) =>
  actionCreator(SocketEvent.SYSTEM_HEARTBEAT, payload)

export const actionPlayerJoined = (playerSerialized: PlayerSerialized) =>
  actionCreator(SocketEvent.SYSTEM_PLAYER_JOINED, playerSerialized)

export const actionInitialize = (serverState: ServerState) =>
  actionCreator(SocketEvent.SYSTEM_INITIALIZE, serverState)

export const actionPlayerLeft = (playerSerialized: PlayerSerialized) =>
  actionCreator(SocketEvent.SYSTEM_PLAYER_LEFT, playerSerialized)

export const actionUpdateName = (name: string) =>
  actionCreator(SocketEvent.SYSTEM_NAME_UPDATE, name)

export const actionPlayerNameChanged = (playerSerialized: PlayerSerialized) =>
  actionCreator(SocketEvent.SYSTEM_NAME_CHANGED, playerSerialized)

export const actionLobbyPlayerJoined = (playerID: PlayerID) =>
  actionCreator(SocketEvent.LOBBY_PLAYER_JOINED, playerID)

export const actionLobbyPlayerLeft = (playerID: PlayerID) =>
  actionCreator(SocketEvent.LOBBY_PLAYER_LEFT, playerID)

export const actionMatchMaking = () =>
  actionCreator(SocketEvent.LOBBY_MAKE_MATCH)

export const actionMatchNewMatch = (matchState: IMatchStateSerialized) =>
  actionCreator(SocketEvent.MATCH_NEW_MATCH, matchState)

export const actionMatchMove = (action: IAction) =>
  actionCreator(SocketEvent.MATCH_MOVE, action)

export const actionMatchMoveError = (errorMessage: string) =>
  actionCreator(SocketEvent.MATCH_MOVE_ERROR, errorMessage, undefined, true)

export const actionMatchNewState = (matchState: IMatchStateSerialized) =>
  actionCreator(SocketEvent.MATCH_NEW_STATE, matchState)
