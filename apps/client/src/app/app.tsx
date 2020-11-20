import React, { useEffect, useState } from 'react'

import socket, {
  socketConnect,
  socketDisconnect,
  socketHeartbeat,
  socketHello,
} from '../sockets'

export function App() {
  const [isConnected, setIsConnected] = useState(socket.connected)
  const [lastMessage, setLastMessage] = useState<null | string>(null)

  useEffect(() => {
    socketConnect.on(() => setIsConnected(true))
    socketDisconnect.on(() => setIsConnected(false))

    socketHeartbeat.on((dataStringISO) =>
      setLastMessage(new Date(dataStringISO).getSeconds().toString())
    )
    return () => {
      socketConnect.off()
      socketDisconnect.off()
      socketHeartbeat.off()
    }
  })

  const sendMessage = () => {
    socketHello.emit('world!')
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
