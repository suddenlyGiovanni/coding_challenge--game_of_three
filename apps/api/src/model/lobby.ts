import type { ILobby, IQueue } from '../interfaces'

import { Queue } from './queue'

import type { PlayerID } from '@game-of-three/contracts'

export class Lobby implements ILobby {
  private static instance: Lobby

  private readonly playersQueue: IQueue<PlayerID>

  private constructor() {
    this.playersQueue = new Queue<PlayerID>()
  }

  public static getInstance(): Lobby {
    if (!Lobby.instance) {
      Lobby.instance = new Lobby()
    }
    return Lobby.instance
  }

  public addPlayerId(playerId: PlayerID): void {
    try {
      if (!this.isPlayerInLobby(playerId)) {
        this.playersQueue.enqueue(playerId)
      } else {
        throw new Error("Can't add a Player that is already in the lobby queue")
      }
    } catch (error: unknown) {
      console.warn(error)
    }
  }

  public getPlayersId(): readonly Readonly<PlayerID>[] {
    return this.playersQueue.toArray()
  }

  public getSize(): number {
    return this.playersQueue.size()
  }

  public isEmpty(): boolean {
    return this.playersQueue.isEmpty()
  }

  public removePlayerId(playerId: PlayerID): void {
    try {
      if (this.isPlayerInLobby(playerId)) {
        this.playersQueue.remove(playerId)
      } else {
        throw new Error("Can't remove a Player that is not in the lobby queue")
      }
    } catch (error: unknown) {
      console.warn(error)
    }
  }

  public reset(): void {
    this.playersQueue.clear()
  }

  private isPlayerInLobby(playerId: PlayerID): boolean {
    if (this.playersQueue.isEmpty()) {
      return false
    }
    return this.playersQueue.toArray().indexOf(playerId) !== -1
  }
}
