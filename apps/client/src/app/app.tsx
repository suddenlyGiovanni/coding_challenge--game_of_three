import React, { useCallback, useEffect, useReducer, useState } from 'react'
import type { ChangeEvent, MouseEvent, Reducer, VFC } from 'react'

import {
  socketConnect,
  socketDisconnect,
  socketHeartbeat,
  socketHello,
  socketInitialize,
  socketMakeMatch,
  socketMatchMove,
  socketNameChanged,
  socketPlayerJoined,
  socketPlayerLeft,
  socketUpdateName,
} from '../sockets'

import {
  ActionWithPayload,
  IAction,
  PlayerSerialized,
  SocketEvent,
} from '@game-of-three/api-interfaces'

const actionCreator = <Type extends string, Payload>(
  type: Type,
  payload: Payload
): ActionWithPayload<Type, Payload> => ({ payload, type } as const)

const syncHeartbeat = (heartbeat: DateISOString) =>
  actionCreator('SYNC_HEARTBEAT', heartbeat)

const toggleConnected = (connected: boolean) =>
  actionCreator('TOGGLE_CONNECTED', connected)

const initializePlayers = (playersSerialized: PlayerSerialized[]) =>
  actionCreator('INITIALIZE_PLAYERS', playersSerialized)

const addPlayer = (playerSerialized: PlayerSerialized) =>
  actionCreator('ADD_PLAYER', playerSerialized)

const removePlayer = (playerSerialized: PlayerSerialized) =>
  actionCreator('REMOVE_PLAYER', playerSerialized)

const updatePlayer = (playerSerialized: PlayerSerialized) =>
  actionCreator('UPDATE_PLAYER', playerSerialized)

type DateISOString = string
interface State {
  readonly connected: boolean
  readonly heartbeat: DateISOString
  readonly players: ReadonlyArray<PlayerSerialized>
}

const initialState: State = {
  connected: false,
  heartbeat: '',
  players: [],
}
type Actions =
  | ReturnType<typeof syncHeartbeat>
  | ReturnType<typeof toggleConnected>
  | ReturnType<typeof initializePlayers>
  | ReturnType<typeof addPlayer>
  | ReturnType<typeof removePlayer>
  | ReturnType<typeof updatePlayer>

const reducer: Reducer<State, Actions> = (state, action) => {
  switch (action.type) {
    case 'SYNC_HEARTBEAT':
      return {
        ...state,
        heartbeat: new Date(action.payload).getSeconds().toString(),
      }

    case 'TOGGLE_CONNECTED':
      return { ...state, connected: action.payload }

    case 'INITIALIZE_PLAYERS':
      return { ...state, players: action.payload }

    case 'ADD_PLAYER':
      return { ...state, players: [...state.players, action.payload] }

    case 'UPDATE_PLAYER':
      return {
        ...state,
        players: state.players
          .slice()
          .map((p) => (p.id === action.payload.id ? action.payload : p)),
      }

    case 'REMOVE_PLAYER':
      return {
        ...state,
        players: state.players.filter((p) => p.id !== action.payload.id),
      }

    default:
      throw new Error('unhandled type')
  }
}

export const App: VFC = () => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const [name, setName] = useState<string>('')

  useEffect(() => {
    socketConnect.on(() => dispatch(toggleConnected(true)))
    socketDisconnect.on(() => dispatch(toggleConnected(false)))

    socketInitialize.on(handleInitialize)

    socketPlayerJoined.on(handlePlayerJoined)

    socketPlayerLeft.on(handlePlayerLeft)

    socketNameChanged.on(handleNameChanged)

    socketHeartbeat.on(handleHeartbeat)
    return () => {
      socketConnect.off()
      socketDisconnect.off()
      socketHeartbeat.off()
      socketPlayerJoined.off()
      socketPlayerLeft.off()
      socketInitialize.off()
      socketNameChanged.off()
    }
  })

  const handleHeartbeat = useCallback(
    (action: ActionWithPayload<SocketEvent.SYSTEM_HEARTBEAT, string>): void =>
      dispatch(syncHeartbeat(action.payload)),
    []
  )

  const handleInitialize = useCallback(
    (
      action: ActionWithPayload<
        SocketEvent.SYSTEM_INITIALIZE,
        PlayerSerialized[]
      >
    ): void => dispatch(initializePlayers(action.payload)),
    []
  )

  const handleNameChanged = useCallback(
    (
      action: ActionWithPayload<
        SocketEvent.SYSTEM_NAME_CHANGED,
        PlayerSerialized
      >
    ): void => dispatch(updatePlayer(action.payload)),
    []
  )

  const handlePlayerJoined = useCallback(
    (
      action: ActionWithPayload<
        SocketEvent.SYSTEM_PLAYER_JOINED,
        PlayerSerialized
      >
    ): void => dispatch(addPlayer(action.payload)),
    []
  )

  const handlePlayerLeft = useCallback(
    (
      action: ActionWithPayload<
        SocketEvent.SYSTEM_PLAYER_LEFT,
        PlayerSerialized
      >
    ): void => dispatch(removePlayer(action.payload)),
    []
  )

  const sendMessage = useCallback(() => socketHello.emit('world!'), [])

  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>): void => {
      setName(e.currentTarget.value)
    },
    []
  )

  const handleUpdate = (
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ): void => {
    console.log(name)
    socketUpdateName.emit(name)
  }

  const handleAction = useCallback(
    (event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>): void => {
      const action = Number(event.currentTarget.dataset['action']) as IAction
      socketMatchMove.emit(action)
    },
    []
  )

  const handleInitiateMatchMaking = useCallback(() => {
    socketMakeMatch.emit(void 0)
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <p>Connected: {`${String(state.connected)}`}</p>
        <p>Last message: {state.heartbeat}</p>
      </header>
      <main>
        <section>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="name"
            id="name"
            onChange={handleInputChange}
          />
          <button type="button" onClick={handleUpdate}>
            Update name
          </button>
        </section>

        <section>
          <button onClick={sendMessage} id="hello">
            Say hello!
          </button>
        </section>

        <section>
          <button type="button" onClick={handleInitiateMatchMaking}>
            match making
          </button>
        </section>

        <section>
          <button type="button" data-action={-1} onClick={handleAction}>
            -1
          </button>

          <button type="button" data-action={0} onClick={handleAction}>
            0
          </button>

          <button type="button" data-action={1} onClick={handleAction}>
            +1
          </button>
        </section>

        <section>
          <pre>{JSON.stringify({ state }, null, 2)}</pre>
        </section>
      </main>
    </div>
  )
}

export default App
