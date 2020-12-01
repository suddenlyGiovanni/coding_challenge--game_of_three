import { createSocket } from './socket'

import { SocketEvent } from '@game-of-three/contracts'

export const socketConnect = createSocket(SocketEvent.INTERNAL_CONNECT)
export const socketDisconnect = createSocket(SocketEvent.INTERNAL_DISCONNECT)

export const socketHeartbeat = createSocket(SocketEvent.SYSTEM_HEARTBEAT)
export const socketHello = createSocket(SocketEvent.SYSTEM_HELLO)
export const socketPlayerJoined = createSocket(SocketEvent.SYSTEM_PLAYER_JOINED)
export const socketPlayerLeft = createSocket(SocketEvent.SYSTEM_PLAYER_LEFT)
export const socketInitialize = createSocket(SocketEvent.SYSTEM_INITIALIZE)
export const socketUpdateName = createSocket(SocketEvent.SYSTEM_NAME_UPDATE)
export const socketNameChanged = createSocket(SocketEvent.SYSTEM_NAME_CHANGED)

export const socketPlayerJoinedLobby = createSocket(
  SocketEvent.LOBBY_PLAYER_JOINED
)
export const socketPlayerLeftLobby = createSocket(SocketEvent.LOBBY_PLAYER_LEFT)

export const socketMakeMatch = createSocket(SocketEvent.LOBBY_MAKE_MATCH)
export const socketNewMatch = createSocket(SocketEvent.MATCH_NEW_MATCH)
export const socketMatchMove = createSocket(SocketEvent.MATCH_MOVE)
export const socketNewMatchState = createSocket(SocketEvent.MATCH_NEW_STATE)
export const socketMatchEnded = createSocket(SocketEvent.MATCH_END_STATE)
export const socketMatchError = createSocket(SocketEvent.MATCH_MOVE_ERROR)
