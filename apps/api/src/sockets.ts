import type { Server as IO, Socket } from 'socket.io'

import type { IEvents } from '@game-of-three/contracts'

export interface SocketActionFn<Payload> {
  (socket: Socket): (payload: Payload) => void
}

export interface WrappedServerSocket<
  Event extends keyof IEvents,
  Payload extends IEvents[Event]
> {
  callback: SocketActionFn<Payload>
  event: Event
}

export type EventEmitterFunction = <Event extends keyof IEvents>(
  event: Event,
  action: IEvents[Event]
) => void

interface Broadcast {
  (io: IO): EventEmitterFunction
}

/**
 * sending to all connected clients
 */
export const broadcast: Broadcast = (io) => (event, action) => {
  io.emit(event, action)
}

interface EmitToSocket {
  (socket: Socket): EventEmitterFunction
}

/**
 * sending to the client
 */
export const emitToSocket: EmitToSocket = (socket) => (event, action) => {
  socket.emit(event, action)
}

type EmitToAllSockets = (socket: Socket) => EventEmitterFunction

/**
 * sending to all clients except sender ('socket')
 */
export const emitToAllSockets: EmitToAllSockets = (socket) => (
  event,
  action
) => {
  socket.broadcast.emit(event, action)
}

interface EmitToSocketId {
  (io: IO): (socketId: string) => EventEmitterFunction
}

/**
 * sending to individual socketid (private message)
 */
export const emitToSocketId: EmitToSocketId = (io) => (socketId) => (
  event,
  action
) => {
  io.to(socketId).emit(event, action)
}

interface BroadcastToRoom {
  (io: IO): (room: string) => EventEmitterFunction
}

/**
 * sending to all sockets in `room`, including sender
 */
export const broadcastToRoom: BroadcastToRoom = (io) => (room) => (
  event,
  action
) => {
  io.in(room).emit(event, action)
}

interface CreateSocket {
  <Event extends keyof IEvents, Payload extends IEvents[Event]>(
    event: Event,
    callback?: SocketActionFn<Payload>
  ): WrappedServerSocket<Event, Payload>
}

/**
 * wraps socketIo in a type safe socket factory
 */
export const createSocket: CreateSocket = (event, callback) =>
  ({ callback, event } as const)
