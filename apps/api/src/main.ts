import { Server } from './server'

const server = Server.getInstance()

export const io = server.getIO()
