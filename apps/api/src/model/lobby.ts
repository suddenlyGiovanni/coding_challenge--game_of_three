import { Queue } from './queue'

import type { Human } from './human'
import type { ILobby, IQueue } from '../interfaces'

export class Lobby implements ILobby {
  private readonly playersQueue: IQueue<Human>
  private static instance: Lobby

  private constructor() {
    this.playersQueue = new Queue<Human>()
  }
  public reset(): void {
    this.playersQueue.clear()
  }

  public getPlayers(): readonly Readonly<Human>[] {
    return this.playersQueue.toArray()
  }

  public getSize(): number {
    return this.playersQueue.size()
  }

  public addPlayer(player: Human): void {
    try {
      if (!this.isPlayerInLobby(player)) {
        this.playersQueue.enqueue(player)
      } else {
        throw new Error("Can't add a Player that is already in the lobby queue")
      }
    } catch (error: unknown) {
      console.warn(error)
    }
  }

  private isPlayerInLobby(player: Human): boolean {
    if (this.playersQueue.isEmpty()) {
      return false
    }
    return this.playersQueue.toArray().indexOf(player) !== -1
  }

  public removePlayer(player: Human): void {
    try {
      if (this.isPlayerInLobby(player)) {
        this.playersQueue.remove(player)
      } else {
        throw new Error("Can't remove a Player that is not in the lobby queue")
      }
    } catch (error: unknown) {
      console.warn(error)
    }
  }

  public static getInstance(): ILobby {
    if (!Lobby.instance) {
      Lobby.instance = new Lobby()
    }
    return Lobby.instance
  }
}
