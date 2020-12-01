import React, { useCallback, useEffect, useState } from 'react'
import type { ChangeEvent, MouseEvent, VFC } from 'react'
import { useSelector } from 'react-redux'

import {
  addPlayer,
  addPlayerToLobby,
  initializePlayers,
  removePlayer,
  removePlayerFromLobby,
  syncHeartbeat,
  toggleConnected,
  updateMatchState,
  updatePlayer,
} from '../features'
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

import { RootState, useAppDispatch } from '../store'

import { IAction } from '@game-of-three/contracts'

export const App: VFC = () => {
  const dispatch = useAppDispatch()
  const state = useSelector((state: RootState) => state.system)

  const [name, setName] = useState<string>('')

  useEffect(() => {
    socketConnect.on(() => dispatch(toggleConnected(true)))
    socketDisconnect.on(() => dispatch(toggleConnected(false)))
    socketHeartbeat.on((event) =>
      dispatch(syncHeartbeat(new Date(event.payload).getSeconds().toString()))
    )

    socketInitialize.on((event) => dispatch(initializePlayers(event.payload)))

    socketPlayerJoined.on((event) => dispatch(addPlayer(event.payload)))

    socketPlayerLeft.on((event) => dispatch(removePlayer(event.payload)))

    socketNameChanged.on((event) => dispatch(updatePlayer(event.payload)))

    socketPlayerJoinedLobby.on((event) =>
      dispatch(addPlayerToLobby(event.payload))
    )

    socketPlayerLeftLobby.on((event) =>
      dispatch(removePlayerFromLobby(event.payload))
    )

    socketNewMatchState.on((event) => dispatch(updateMatchState(event.payload)))

    socketMatchEnded.on(() => console.log('match ended'))

    socketMatchError.on((event) => console.log(event))

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
