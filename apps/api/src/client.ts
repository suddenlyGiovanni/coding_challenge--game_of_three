import { Manager } from 'socket.io-client'

const manager = new Manager('ws://localhost:3333')
const socket = manager.socket('/')

socket.on('connect', () => {
  console.log(`connect ${socket.id}`)
})

socket.on('disconnect', () => {
  console.log(`disconnect`)
})
socket.on('pong', () => {
  socket.emit('ping')
})

setInterval(() => {
  socket.emit('ping', () => console.log('ping'))
}, 1000)
