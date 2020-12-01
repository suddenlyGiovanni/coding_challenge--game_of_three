import type { ILobby, IQueue } from '../interfaces'

import { Queue } from './queue'

import type { PlayerID } from '@game-of-three/contracts'

export class Lobby implements ILobby {
  private static instance: Lobby

  private readonly _queue: IQueue<PlayerID>

  private constructor() {
    this._queue = new Queue<PlayerID>()
  }

  public static getInstance(): Lobby {
    if (!Lobby.instance) {
      Lobby.instance = new Lobby()
    }
    return Lobby.instance
  }

  public addPlayerId(playerId: PlayerID): void {
    try {
      if (!this._isPlayerIdInLobby(playerId)) {
        this._queue.enqueue(playerId)
      } else {
        throw new Error("Can't add a Player that is already in the lobby queue")
      }
    } catch (error: unknown) {
      console.warn(error)
    }
  }

  /**
   * TODO: add unit-test
   * @returns {(undefined | PlayerID)}
   * @memberof Lobby
   */
  public getNextPlayerId(): undefined | PlayerID {
    return this._queue.dequeue()
  }

  public get playersId(): readonly Readonly<PlayerID>[] {
    return this._queue.toArray()
  }

  public get size(): number {
    return this._queue.size()
  }

  public isEmpty(): boolean {
    return this._queue.isEmpty()
  }

  public removePlayerId(playerId: PlayerID): void {
    try {
      if (this._isPlayerIdInLobby(playerId)) {
        this._queue.remove(playerId)
      } else {
        throw new Error("Can't remove a Player that is not in the lobby queue")
      }
    } catch (error: unknown) {
      console.warn(error)
    }
  }

  public reset(): void {
    this._queue.clear()
  }

  private _isPlayerIdInLobby(playerId: PlayerID): boolean {
    if (this._queue.isEmpty()) {
      return false
    }
    return this._queue.toArray().indexOf(playerId) !== -1
  }
}
