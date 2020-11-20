import { Manager } from 'socket.io-client'

import type { IEvents, ISocketEvent } from '@game-of-three/api-interfaces'

interface ListenerCallback<T> {
  (data: T): void
}

export interface DataSocket<Event extends keyof IEvents> {
  emit: (data: IEvents[Event]) => void
  off: (callback?: ListenerCallback<IEvents[Event]>) => void
  on: (callback: ListenerCallback<IEvents[Event]>) => void
}

export function createSocket<Event extends keyof IEvents>(
  event: Event
): DataSocket<Event> {
  return {
    emit: emitCallback(event),
    off: offCallback(event),
    on: onCallback(event),
  }
}

function emitCallback<T>(event: ISocketEvent) {
  return (data: T): void => {
    socket.emit(event, data)
  }
}

function onCallback<T>(event: ISocketEvent) {
  return (callback: ListenerCallback<T>): void => {
    socket.on(event, callback)
  }
}

function offCallback<T>(event: ISocketEvent) {
  return (callback?: ListenerCallback<T>): void => {
    socket.off(event, callback)
  }
}

const manager = new Manager('ws://localhost:3000')
const socket = manager.socket('/')

export default socket
