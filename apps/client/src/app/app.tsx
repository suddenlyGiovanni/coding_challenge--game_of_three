import React, { useEffect, useState } from 'react'

import { Manager } from 'socket.io-client'

import { SocketEvent } from '@game-of-three/api-interfaces'

const manager = new Manager('ws://localhost:3000')
const socket = manager.socket('/')

export function App() {
  const [isConnected, setIsConnected] = useState(socket.connected)
  const [lastMessage, setLastMessage] = useState<null | string>(null)

  useEffect(() => {
    socket.on(SocketEvent.CONNECT, () => {
      setIsConnected(true)
    })
    socket.on(SocketEvent.DISCONNECT, () => {
      setIsConnected(false)
    })
    socket.on(SocketEvent.HEARTBEAT, (dataStringISO: string) => {
      setLastMessage(new Date(dataStringISO).getSeconds().toString())
    })
    return () => {
      socket.off(SocketEvent.CONNECT)
      socket.off(SocketEvent.DISCONNECT)
      socket.off(SocketEvent.HEARTBEAT)
    }
  })

  const sendMessage = () => {
    socket.emit('hello', 'world!')
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
