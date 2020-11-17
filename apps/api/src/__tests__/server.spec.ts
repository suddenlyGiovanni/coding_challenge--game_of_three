import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals'
import { Server as IOServer } from 'socket.io'

import type { IServer } from '../interfaces/server.interface'

import { Server } from '../server'

describe('server', () => {
  it('should allow only a single instance at a time (be a Singleton)', () => {
    expect.hasAssertions()
    let server: IServer
    expect(Server).toHaveProperty('getInstance')
    expect(() => {
      server = Server.getInstance()
    }).not.toThrow()
    expect(Server.getInstance()).toBe(server)
  })

  it('should return the `io` instance', () => {
    expect.hasAssertions()
    const server = Server.getInstance()
    expect(server).toHaveProperty('getIO')
    expect(() => server.getIO()).not.toThrow()
    expect(server.getIO()).toBeInstanceOf(IOServer)
  })
})
