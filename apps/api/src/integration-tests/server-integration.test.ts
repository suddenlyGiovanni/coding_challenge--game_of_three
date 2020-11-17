/* eslint-disable @typescript-eslint/no-unsafe-call */
import { afterEach, beforeEach, describe, expect, it } from '@jest/globals'
import Debug from 'debug'

import { MockSocketClient } from './mock-socket-client'
import { TestHelper, flushPromises } from './test-helper'

const debug = Debug('app:Test')

// prepare variables
/*
  this is where the socket.io server is located ex `http://localhost:51245`
*/
const host = (process.env.HOST || '').trim()
const socketClient0a: MockSocketClient = new MockSocketClient(host, 'abc')
const socketClient1a: MockSocketClient = new MockSocketClient(host, '1')
const socketClient1b: MockSocketClient = new MockSocketClient(host, '1')
const socketClient2a: MockSocketClient = new MockSocketClient(host, '2')
const socketClient3a: MockSocketClient = new MockSocketClient(host, '3')

// eslint-disable-next-line jest/no-disabled-tests
describe.skip('socket Client', () => {
  beforeEach(async () => {
    // runs before all tests in this block
  })

  afterEach(async () => {
    // runs after all tests in this block
    socketClient1a.disconnect()
    socketClient1b.disconnect()
    socketClient2a.disconnect()
    socketClient3a.disconnect()
    debug('----------------')
    await flushPromises()
    await TestHelper.timeout(100)
  })

  it(
    'invalid connection',
    async () => {
      expect.hasAssertions()
      await TestHelper.AssertInvalidConnect(socketClient0a)
    },
    30 * 1000 // the first connection make take longer since the server may need cold start
  )

  it('connect fight', async () => {
    expect.hasAssertions()
    // socketClient1a
    await TestHelper.AssertConnect(socketClient1a)
    const promise = new Promise((resolve) =>
      socketClient1a.on('disconnect', resolve)
    )
    await TestHelper.AssertConnect(socketClient1b)

    // socketClient1a
    await promise
    expect(socketClient1a.isConnected).toBe(false)
  })

  it('resume room', async () => {
    expect.hasAssertions()
    // connect
    await TestHelper.AssertConnect(socketClient1a)
    await TestHelper.AssertLeaveIfHasRoom(socketClient1a)

    // create room
    await TestHelper.AssertCreateRoom(socketClient1a)

    // disconnect
    TestHelper.AssertDisconnect(socketClient1a)

    // connect and check has room
    await TestHelper.AssertConnect(socketClient1a)
    await TestHelper.AssertHasRoom(socketClient1a)
    await TestHelper.AssertLeaveRoom(socketClient1a)
  })

  it('join room and chat', async () => {
    expect.hasAssertions()
    // socketClient1a
    await TestHelper.AssertConnect(socketClient1a)
    await TestHelper.AssertLeaveIfHasRoom(socketClient1a)
    await TestHelper.AssertCreateRoom(socketClient1a)

    // socketClient2a
    await TestHelper.AssertConnect(socketClient2a)
    await TestHelper.AssertLeaveIfHasRoom(socketClient2a)
    await TestHelper.AssertJoinRoom(socketClient2a, socketClient1a.roomId)

    // socketClient3a
    await TestHelper.AssertConnect(socketClient3a)
    await TestHelper.AssertInvalidJoinRoom(
      socketClient3a,
      socketClient1a.roomId
    )

    const promise1 = new Promise((resolve) =>
      socketClient1a.once('respondMessageInRoom', resolve)
    )
    const promise2 = new Promise((resolve) =>
      socketClient2a.once('respondMessageInRoom', resolve)
    )

    // socketClient: send chat
    const newMessage = 'Hello World!'
    await TestHelper.AssertChatInRoom(socketClient2a, newMessage)
    await Promise.all([promise1, promise2])
    expect(socketClient1a.chats.length).toBeGreaterThanOrEqual(1)
    expect(socketClient2a.chats.length).toBeGreaterThanOrEqual(1)
    expect(socketClient1a.chats[0]).toBe(newMessage)
  })
})
