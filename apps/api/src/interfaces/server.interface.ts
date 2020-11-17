import type { Server } from 'socket.io'

export interface IServer {
  getIO(): Server
}
