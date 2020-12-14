import { AnyAction, createAction } from '@reduxjs/toolkit'

import { withPayloadType } from '../utils'

import { IEvents, SocketEvent } from '@game-of-three/contracts'

//#region SOCKET INTERNAL
const internalConnection = createAction('SOCKET/INTERNAL_CONNECTION')
export const isInternalConnection = (
  action: AnyAction
): action is ReturnType<typeof internalConnection> =>
  internalConnection.match(action)

const internalDisconnect = createAction(
  'SOCKET/INTERNAL_DISCONNECT',
  withPayloadType<IEvents[SocketEvent.INTERNAL_DISCONNECT]>()
)
export const isInternalDisconnect = (
  action: AnyAction
): action is ReturnType<typeof internalDisconnect> =>
  internalDisconnect.match(action)

//#endregion

//#region SOCKET SYSTEM
const systemHeartbeat = createAction(
  'SOCKET/SYSTEM_HEARTBEAT',
  withPayloadType<IEvents[SocketEvent.SYSTEM_HEARTBEAT]>()
)
export const isSystemHeartbeat = (
  action: AnyAction
): action is ReturnType<typeof systemHeartbeat> => systemHeartbeat.match(action)

const systemInitialize = createAction(
  'SOCKET/SYSTEM_INITIALIZE',
  withPayloadType<IEvents[SocketEvent.SYSTEM_INITIALIZE]>()
)
export const isSystemInitialize = (
  action: AnyAction
): action is ReturnType<typeof systemInitialize> =>
  systemInitialize.match(action)

const systemPlayerJoined = createAction(
  'SOCKET/SYSTEM_PLAYER_JOINED',
  withPayloadType<IEvents[SocketEvent.SYSTEM_PLAYER_JOINED]>()
)
export const isSystemPlayerJoined = (
  action: AnyAction
): action is ReturnType<typeof systemPlayerJoined> =>
  systemPlayerJoined.match(action)

const systemPlayerLeft = createAction(
  'SOCKET/SYSTEM_PLAYER_LEFT',
  withPayloadType<IEvents[SocketEvent.SYSTEM_PLAYER_LEFT]>()
)
export const isSystemPlayerLeft = (
  action: AnyAction
): action is ReturnType<typeof systemPlayerLeft> =>
  systemPlayerLeft.match(action)

const systemPlayerUpdated = createAction(
  'SOCKET/SYSTEM_NAME_CHANGED', //FIXME: rename event to SYSTEM_PLAYER_UPDATED
  withPayloadType<IEvents[SocketEvent.SYSTEM_NAME_CHANGED]>()
)
export const isSystemPlayerUpdated = (
  action: AnyAction
): action is ReturnType<typeof systemPlayerUpdated> =>
  systemPlayerUpdated.match(action)

//#endregion

//#region SOCKET LOBBY
const lobbyPlayerJoined = createAction(
  'SOCKET/LOBBY_PLAYER_JOINED',
  withPayloadType<IEvents[SocketEvent.LOBBY_PLAYER_JOINED]>()
)
export const isLobbyPlayerJoined = (
  action: AnyAction
): action is ReturnType<typeof lobbyPlayerJoined> =>
  lobbyPlayerJoined.match(action)

const lobbyPlayerLeft = createAction(
  'SOCKET/LOBBY_PLAYER_LEFT',
  withPayloadType<IEvents[SocketEvent.LOBBY_PLAYER_LEFT]>()
)
export const isLobbyPlayerLeft = (
  action: AnyAction
): action is ReturnType<typeof lobbyPlayerLeft> => lobbyPlayerLeft.match(action)

//#endregion

//#region SOCKET MATCH
const matchNewState = createAction(
  'SOCKET/MATCH_NEW_STATE',
  withPayloadType<IEvents[SocketEvent.MATCH_NEW_STATE]>()
)
export const isMatchNewState = (
  action: AnyAction
): action is ReturnType<typeof matchNewState> => matchNewState.match(action)

const matchEnded = createAction(
  'SOCKET/MATCH_END_STATE',
  withPayloadType<IEvents[SocketEvent.MATCH_END_STATE]>()
)
export const isMatchEnded = (
  action: AnyAction
): action is ReturnType<typeof matchEnded> => matchEnded.match(action)

const matchError = createAction(
  'SOCKET/MATCH_MOVE_ERROR',
  withPayloadType<IEvents[SocketEvent.MATCH_MOVE_ERROR]>()
)
export const isMatchError = (
  action: AnyAction
): action is ReturnType<typeof matchError> => matchError.match(action)

//#endregion

export default {
  internalConnection,
  internalDisconnect,
  lobbyPlayerJoined,
  lobbyPlayerLeft,
  matchEnded,
  matchError,
  matchNewState,
  systemHeartbeat,
  systemInitialize,
  systemPlayerJoined,
  systemPlayerLeft,
  systemPlayerUpdated,
}
