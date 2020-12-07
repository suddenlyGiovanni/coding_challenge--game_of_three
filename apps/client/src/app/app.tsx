// eslint-disable-next-line import/no-unresolved
import type { RootState } from '@MyTypes'
import React, { useCallback, useState } from 'react'
import type { ChangeEvent, MouseEvent, VFC } from 'react'
import { useSelector } from 'react-redux'

import * as connectionFeatures from '../features/connection'
import * as matchFeatures from '../features/match'
import * as messagesFeature from '../features/messages'
import * as systemFeature from '../features/system'
import { useAppDispatch } from '../store'

import { IAction } from '@game-of-three/contracts'

const User: VFC = () => {
  const dispatch = useAppDispatch()
  const [name, setName] = useState<string>('')
  const user = useSelector(systemFeature.selectUser)

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void =>
    setName(e.currentTarget.value)

  const handleUpdate = () =>
    dispatch(systemFeature.actions.userNameUpdated(name))

  return (
    <section>
      <label htmlFor="name">Name</label>
      <input type="text" name="name" id="name" onChange={handleInputChange} />
      <button type="button" onClick={handleUpdate}>
        Update name
      </button>
      <div>
        <p>User:</p>
        <pre>{JSON.stringify({ user }, null, 2)}</pre>
      </div>
    </section>
  )
}

const Heartbeat: VFC = () => {
  const heartbeat = useSelector(systemFeature.selectHeartbeat)
  return (
    <p>
      Heartbeat:{' '}
      <span id="heartbeat">
        {heartbeat && new Date(heartbeat).getMinutes()}
      </span>
    </p>
  )
}

const Connection: VFC = () => {
  const connected = useSelector(connectionFeatures.selectConnection)
  return (
    <p>
      Connected: <span id="connected">{String(connected)}</span>
    </p>
  )
}

const Matchmaking: VFC = () => {
  const dispatch = useAppDispatch()
  const handleInitiateMatchMaking = () =>
    dispatch(matchFeatures.actions.matchNewGame())

  return (
    <button type="button" onClick={handleInitiateMatchMaking}>
      match making
    </button>
  )
}

const MatchActionsControls: VFC = () => {
  const dispatch = useAppDispatch()

  const handleAction = useCallback(
    (event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>): void => {
      const action = Number(event.currentTarget.dataset['action']) as IAction
      dispatch(matchFeatures.actions.matchMove(action))
    },
    [dispatch]
  )
  return (
    <div className="btn-group">
      <button type="button" data-action={-1} onClick={handleAction}>
        -1
      </button>

      <button type="button" data-action={0} onClick={handleAction}>
        0
      </button>

      <button type="button" data-action={1} onClick={handleAction}>
        +1
      </button>
    </div>
  )
}

const Match: VFC = () => {
  const match = useSelector(matchFeatures.selectMatch)
  return (
    <section>
      <h2>Match</h2>
      <MatchActionsControls />
      <pre>{JSON.stringify(match, null, 2)}</pre>
    </section>
  )
}

const Greet: VFC = () => {
  const dispatch = useAppDispatch()
  const sendMessage = () => dispatch(messagesFeature.actions.greet('world!'))
  return (
    <section>
      <button onClick={sendMessage} id="hello">
        Say hello!
      </button>
    </section>
  )
}

export const App: VFC = () => {
  return (
    <div className="App">
      <main>
        <Connection />
        <Heartbeat />
        <Greet />
        <User />
        <Matchmaking />
        <Match />
      </main>
    </div>
  )
}
