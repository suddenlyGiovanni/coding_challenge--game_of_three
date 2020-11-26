import { Manager } from 'socket.io-client'

import type { Action, IEvents } from '@game-of-three/contracts'

interface ListenerCallback<Action> {
  (action: Action): void
}

export interface DataSocket<Event extends keyof IEvents> {
  emit: <Data extends IEvents[Event]>(
    data: Data extends Action<Event, unknown> ? Data['payload'] : Data
  ) => void
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

function emitCallback<Event extends keyof IEvents, Data>(event: Event) {
  return (data: Data): void => {
    const action: Action<Event, Data> = {
      payload: data,
      type: event,
    }
    socket.emit(event, action)
  }
}

function onCallback<Event extends keyof IEvents, Action>(event: Event) {
  return (callback: ListenerCallback<Action>): void => {
    socket.on(event, callback)
  }
}

function offCallback<Event extends keyof IEvents, Action>(event: Event) {
  return (callback?: ListenerCallback<Action>): void => {
    socket.off(event, callback)
  }
}

const manager = new Manager('ws://localhost:3000')
const socket = manager.socket('/')

export default socket
