import React, { useCallback, useEffect, useState } from 'react'
import type { ChangeEvent, MouseEvent, VFC } from 'react'
import { useSelector } from 'react-redux'

import { toggleConnected } from '../features/connection'
import { syncHeartbeat } from '../features/heartbeat'
import { initialize } from '../features/initialize/initialize.action'
import { addPlayerToLobby, removePlayerFromLobby } from '../features/lobby'
import { matchMove, matchNewGame, matchNewState } from '../features/match'
import { playerUpdateName } from '../features/player'
import {
  playersAddOne,
  playersRemoveOne,
  playersUpdateOne,
} from '../features/players'

import { socketService } from '../socket-service'
import { RootState, useAppDispatch } from '../store'

import { IAction } from '@game-of-three/contracts'

export const App: VFC = () => {
  const dispatch = useAppDispatch()
  const state = useSelector((state: RootState) => state)

  const [name, setName] = useState<string>('')

  useEffect(() => {
    const connectionObservable = socketService.onConnection()
    const disconnectionObservable = socketService.onDisconnection()
    const heartbeatObservable = socketService.onHeartbeat()
    const initializeObservable = socketService.onInitialize()
    const matchEndedObservable = socketService.onMatchEnded()
    const matchErrorObservable = socketService.onMatchError()
    const newMatchStateObservable = socketService.onNewMatchState()
    const playerJoinedObservable = socketService.onPlayerJoined()
    const playerJoinedLobbyObservable = socketService.onPlayerJoinedLobby()
    const playerLeftObservable = socketService.onPlayerLeft()
    const playerLeftLobbyObservable = socketService.onPlayerLeftLobby()
    const nameChangedObservable = socketService.onNameChanged()

    const connectionSubscription = connectionObservable.subscribe(() => {
      console.log('connection event')
      dispatch(toggleConnected(true))
    })

    const disconnectionSubscription = disconnectionObservable.subscribe(
      (reason) => {
        console.log(`disconnection event. reason ${reason}`)
        dispatch(toggleConnected(false))
      }
    )

    const heartbeatSubscription = heartbeatObservable.subscribe((event) => {
      dispatch(syncHeartbeat(new Date(event.payload).getSeconds().toString()))
    })

    const initializeSubscription = initializeObservable.subscribe((event) => {
      dispatch(initialize(event.payload))
    })

    const matchEndedSubscription = matchEndedObservable.subscribe(() =>
      console.log('match ended')
    )

    const matchErrorSubscription = matchErrorObservable.subscribe((event) =>
      console.log(event)
    )

    const newMatchStateSubscription = newMatchStateObservable.subscribe(
      (event) => dispatch(matchNewState(event.payload))
    )

    const playerJoinedSubscription = playerJoinedObservable.subscribe((event) =>
      dispatch(playersAddOne(event.payload))
    )

    const playerLeftSubscription = playerLeftObservable.subscribe((event) =>
      dispatch(playersRemoveOne(event.payload))
    )
    const nameChangedSubscription = nameChangedObservable.subscribe((event) =>
      dispatch(playersUpdateOne(event.payload))
    )

    const playerJoinedLobbySubscription = playerJoinedLobbyObservable.subscribe(
      (event) => dispatch(addPlayerToLobby(event.payload))
    )

    const playerLeftLobbySubscription = playerLeftLobbyObservable.subscribe(
      (event) => dispatch(removePlayerFromLobby(event.payload))
    )

    return () => {
      connectionSubscription.unsubscribe()
      disconnectionSubscription.unsubscribe()
      heartbeatSubscription.unsubscribe()
      initializeSubscription.unsubscribe()
      matchEndedSubscription.unsubscribe()
      matchErrorSubscription.unsubscribe()
      newMatchStateSubscription.unsubscribe()
      playerJoinedSubscription.unsubscribe()
      playerLeftSubscription.unsubscribe()
      nameChangedSubscription.unsubscribe()
      playerJoinedLobbySubscription.unsubscribe()
      playerLeftLobbySubscription.unsubscribe()
    }
  }, [dispatch])

  const sendMessage = useCallback(() => socketService.emitHello('world!'), [])

  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>): void => {
      setName(e.currentTarget.value)
    },
    []
  )

  const handleUpdate = () => dispatch(playerUpdateName(name))

  const handleAction = useCallback(
    (event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>): void => {
      const action = Number(event.currentTarget.dataset['action']) as IAction
      dispatch(matchMove(action))
    },
    [dispatch]
  )

  const handleInitiateMatchMaking = useCallback(
    () => dispatch(matchNewGame()),
    [dispatch]
  )

  return (
    <div className="App">
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
