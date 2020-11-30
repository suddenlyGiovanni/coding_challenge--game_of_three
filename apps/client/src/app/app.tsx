import React, { useCallback, useEffect, useReducer, useState } from 'react'
import type { ChangeEvent, MouseEvent, Reducer, VFC } from 'react'

import {
  socketConnect,
  socketDisconnect,
  socketHeartbeat,
  socketHello,
  socketInitialize,
  socketMakeMatch,
  socketMatchEnded,
  socketMatchError,
  socketMatchMove,
  socketNameChanged,
  socketNewMatchState,
  socketPlayerJoined,
  socketPlayerJoinedLobby,
  socketPlayerLeft,
  socketPlayerLeftLobby,
  socketUpdateName,
} from '../sockets'

import {
  Action,
  ActionWithPayload,
  IAction,
  IMatchStatePlayingSerialized,
  IMatchStateSerialized,
  IMatchStateStartSerialized,
  IMatchStateStopSerialized,
  PlayerID,
  PlayerSerialized,
  ServerState,
  SocketEvent,
  actionCreator,
} from '@game-of-three/contracts'

const syncHeartbeat = (heartbeat: DateISOString) =>
  actionCreator('[HEARTBEAT]-SYNC', heartbeat)

const toggleConnected = (connected: boolean) =>
  actionCreator('[CONNECTED]-TOGGLE', connected)

const initializePlayers = (initialState: ServerState) =>
  actionCreator('[STATE]-INITIALIZE', initialState)

const addPlayer = (playerSerialized: PlayerSerialized) =>
  actionCreator('[PLAYERS]-ADD_PLAYER', playerSerialized)

const removePlayer = (playerSerialized: PlayerSerialized) =>
  actionCreator('[PLAYERS]-REMOVE_PLAYER', playerSerialized)

const updatePlayer = (playerSerialized: PlayerSerialized) =>
  actionCreator('[PLAYERS]-UPDATE_PLAYER', playerSerialized)

const addPlayerToLobby = (playerId: PlayerID) =>
  actionCreator('[LOBBY]-ADD_PLAYER', playerId)

const removePlayerFromLobby = (playerId: PlayerID) =>
  actionCreator('[LOBBY]-REMOVE_PLAYER', playerId)

const updateMatchState = (matchState: IMatchStateSerialized) =>
  actionCreator('[MATCH]-NEW_STATE', matchState)

type DateISOString = string
interface State {
  readonly connected: boolean
  readonly heartbeat: DateISOString
  readonly lobby: ReadonlyArray<PlayerID>
  readonly matchState: IMatchStateSerialized[]
  readonly players: ReadonlyArray<PlayerSerialized>
}

const initialState: State = {
  connected: false,
  heartbeat: '',
  lobby: [],
  matchState: [],
  players: [],
}
type Actions =
  | ReturnType<typeof updateMatchState>
  | ReturnType<typeof syncHeartbeat>
  | ReturnType<typeof toggleConnected>
  | ReturnType<typeof initializePlayers>
  | ReturnType<typeof addPlayer>
  | ReturnType<typeof removePlayer>
  | ReturnType<typeof updatePlayer>
  | ReturnType<typeof addPlayerToLobby>
  | ReturnType<typeof removePlayerFromLobby>

const reducer: Reducer<State, Actions> = (state, action) => {
  switch (action.type) {
    case '[MATCH]-NEW_STATE':
      return {
        ...state,
        matchState: [...state.matchState, action.payload],
      }

    case '[HEARTBEAT]-SYNC':
      return {
        ...state,
        heartbeat: new Date(action.payload).getSeconds().toString(),
      }

    case '[CONNECTED]-TOGGLE':
      return { ...state, connected: action.payload }

    case '[STATE]-INITIALIZE':
      return {
        ...state,
        lobby: [...state.lobby, ...action.payload.lobby],
        players: [...state.players, ...action.payload.players],
      }

    case '[PLAYERS]-ADD_PLAYER':
      return { ...state, players: [...state.players, action.payload] }

    case '[PLAYERS]-UPDATE_PLAYER':
      return {
        ...state,
        players: state.players
          .slice()
          .map((p) => (p.id === action.payload.id ? action.payload : p)),
      }

    case '[PLAYERS]-REMOVE_PLAYER':
      return {
        ...state,
        players: state.players.filter((p) => p.id !== action.payload.id),
      }

    case '[LOBBY]-ADD_PLAYER':
      return {
        ...state,
        lobby: [...state.lobby, action.payload],
      }

    case '[LOBBY]-REMOVE_PLAYER':
      return {
        ...state,
        lobby: state.lobby
          .slice()
          .filter((playerId) => playerId !== action.payload),
      }

    default:
      throw new Error('unhandled type')
  }
}

const handleMatchEnded = () => console.log('match ended')
const handleMatchError = (
  action: Action<SocketEvent.MATCH_MOVE_ERROR, string, any, true>
): void => console.log(action)
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

    socketPlayerJoinedLobby.on(handlePlayerJoinedLobby)

    socketPlayerLeftLobby.on(handlePlayerLeftLobby)

    socketNewMatchState.on(handleNewMatchState)

    socketMatchEnded.on(handleMatchEnded)

    socketMatchError.on(handleMatchError)

    return () => {
      socketConnect.off()
      socketDisconnect.off()
      socketHeartbeat.off()
      socketPlayerJoined.off()
      socketPlayerLeft.off()
      socketInitialize.off()
      socketNameChanged.off()
      socketPlayerJoinedLobby.off()
      socketPlayerLeftLobby.off()
      socketNewMatchState.off()
      socketMatchEnded.off()
      socketMatchError.off()
    }
  })

  const handleNewMatchState = useCallback(
    (
      event:
        | ActionWithPayload<
            SocketEvent.MATCH_NEW_STATE,
            IMatchStateStartSerialized<string>
          >
        | ActionWithPayload<
            SocketEvent.MATCH_NEW_STATE,
            IMatchStatePlayingSerialized<string>
          >
        | ActionWithPayload<
            SocketEvent.MATCH_NEW_STATE,
            IMatchStateStopSerialized<string>
          >
    ): void => dispatch(updateMatchState(event.payload)),
    [dispatch]
  )

  const handlePlayerJoinedLobby = useCallback(
    (
      event: ActionWithPayload<SocketEvent.LOBBY_PLAYER_JOINED, PlayerID>
    ): void => dispatch(addPlayerToLobby(event.payload)),
    []
  )

  const handlePlayerLeftLobby = useCallback(
    (event: ActionWithPayload<SocketEvent.LOBBY_PLAYER_LEFT, PlayerID>): void =>
      dispatch(removePlayerFromLobby(event.payload)),
    [dispatch]
  )

  const handleHeartbeat = useCallback(
    (action: ActionWithPayload<SocketEvent.SYSTEM_HEARTBEAT, string>): void =>
      dispatch(syncHeartbeat(action.payload)),
    [dispatch]
  )

  const handleInitialize = useCallback(
    (
      event: ActionWithPayload<SocketEvent.SYSTEM_INITIALIZE, ServerState>
    ): void => dispatch(initializePlayers(event.payload)),
    [dispatch]
  )

  const handleNameChanged = useCallback(
    (
      action: ActionWithPayload<
        SocketEvent.SYSTEM_NAME_CHANGED,
        PlayerSerialized
      >
    ): void => dispatch(updatePlayer(action.payload)),
    [dispatch]
  )

  const handlePlayerJoined = useCallback(
    (
      action: ActionWithPayload<
        SocketEvent.SYSTEM_PLAYER_JOINED,
        PlayerSerialized
      >
    ): void => dispatch(addPlayer(action.payload)),
    [dispatch]
  )

  const handlePlayerLeft = useCallback(
    (
      action: ActionWithPayload<
        SocketEvent.SYSTEM_PLAYER_LEFT,
        PlayerSerialized
      >
    ): void => dispatch(removePlayer(action.payload)),
    [dispatch]
  )

  const sendMessage = useCallback(() => socketHello.emit('world!'), [])

  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>): void => {
      setName(e.currentTarget.value)
    },
    []
  )

  const handleUpdate = (): void => socketUpdateName.emit(name)

  const handleAction = useCallback(
    (event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>): void => {
      const action = Number(event.currentTarget.dataset['action']) as IAction
      socketMatchMove.emit(action)
    },
    []
  )

  const handleInitiateMatchMaking = useCallback(
    () => socketMakeMatch.emit(void 0),
    []
  )

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
