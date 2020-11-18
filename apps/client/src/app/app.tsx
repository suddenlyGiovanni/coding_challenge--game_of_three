import React, { useEffect, useState } from 'react'

import { Manager } from 'socket.io-client'

const manager = new Manager('ws://localhost:3000')
const socket = manager.socket('/')

export function App() {
  const [isConnected, setIsConnected] = useState(socket.connected)
  const [lastMessage, setLastMessage] = useState<null | string>(null)

  useEffect(() => {
    socket.on('connect', () => {
      setIsConnected(true)
    })
    socket.on('disconnect', () => {
      setIsConnected(false)
    })
    socket.on('message', (data: string) => {
      setLastMessage(data)
    })
    return () => {
      socket.off('connect')
      socket.off('disconnect')
      socket.off('message')
    }
  })

  const sendMessage = () => {
    socket.emit('hello!')
  }

  return (
    <div className="App">
      <header className="App-header">
        <p>Connected: {`${String(isConnected)}`}</p>
        <p>Last message: {lastMessage || '-'}</p>
        <button onClick={sendMessage}>Say hello!</button>
      </header>
    </div>
  )
}

export default App
