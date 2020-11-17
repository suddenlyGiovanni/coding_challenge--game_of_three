/* eslint-disable jest/no-standalone-expect */
import { expect } from '@jest/globals'

import { MockSocketClient } from './mock-socket-client'

export const flushPromises = (): Promise<void> =>
  new Promise((res) => process.nextTick(res))

export class TestHelper {
  public static async AssertChatInRoom(
    socketClient: MockSocketClient,
    message: string
  ) {
    expect(socketClient.hasRoom).toBe(true)
    await socketClient.chatInRoom(message)
  }

  public static async AssertConnect(
    socketClient: MockSocketClient
  ): Promise<void> {
    const promise = socketClient.connect()
    expect(socketClient.isConnecting).toBe(true)
    await promise
    expect(socketClient.isConnected).toBe(true)
  }

  public static async AssertCreateRoom(
    socketClient: MockSocketClient
  ): Promise<void> {
    await socketClient.createRoom()
    expect(socketClient.hasRoom).toBe(true)
  }

  public static AssertDisconnect(socketClient: MockSocketClient): void {
    expect(socketClient.isConnected).toBe(true)
    socketClient.disconnect()
    expect(socketClient.isConnected).toBe(false)
    expect(socketClient.hasRoom).toBe(false)
  }

  public static async AssertHasRoom(
    socketClient: MockSocketClient
  ): Promise<void> {
    await socketClient.getRoom()
    expect(socketClient.hasRoom).toBe(true)
  }

  public static async AssertInvalidConnect(
    socketClient: MockSocketClient
  ): Promise<void> {
    try {
      await socketClient.connect()
      expect(true).toBe(false)
    } catch (err) {
      expect(true).toBe(true)
    }
  }

  public static async AssertInvalidJoinRoom(
    socketClient: MockSocketClient,
    roomId: string
  ): Promise<void> {
    await socketClient.joinRoom(roomId)
    expect(socketClient.hasRoom).toBe(false)
  }

  public static async AssertJoinRoom(
    socketClient: MockSocketClient,
    roomId: string
  ): Promise<void> {
    await socketClient.joinRoom(roomId)
    expect(socketClient.hasRoom).toBe(true)
  }

  public static async AssertLeaveIfHasRoom(
    socketClient: MockSocketClient
  ): Promise<void> {
    await socketClient.getRoom()
    await socketClient.leaveRoom()
  }

  public static async AssertLeaveRoom(socketClient: MockSocketClient) {
    expect(socketClient.hasRoom).toBe(true)
    await socketClient.leaveRoom()
    expect(socketClient.hasRoom).toBe(false)
  }

  public static timeout = (ms: number): Promise<void> =>
    new Promise((resolve) => setTimeout(resolve, ms))
}
