import { createSocket } from './socket'

import { SocketEvent } from '@game-of-three/api-interfaces'

export const socketHello = createSocket(SocketEvent.HELLO)
export const socketConnect = createSocket(SocketEvent.CONNECT)
export const socketDisconnect = createSocket(SocketEvent.DISCONNECT)

export const socketHeartbeat = createSocket(SocketEvent.HEARTBEAT)
