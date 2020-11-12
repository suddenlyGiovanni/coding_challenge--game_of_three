import type { ILobby, IQueue } from '../interfaces'

import type { Human } from './human'
import { Queue } from './queue'

export class Lobby implements ILobby {
  private static instance: Lobby

  private readonly playersQueue: IQueue<Human>

  private constructor() {
    this.playersQueue = new Queue<Human>()
  }

  public static getInstance(): ILobby {
    if (!Lobby.instance) {
      Lobby.instance = new Lobby()
    }
    return Lobby.instance
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

  public getPlayers(): readonly Readonly<Human>[] {
    return this.playersQueue.toArray()
  }

  public getSize(): number {
    return this.playersQueue.size()
  }

  public isEmpty(): boolean {
    return this.playersQueue.isEmpty()
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

  public reset(): void {
    this.playersQueue.clear()
  }

  private isPlayerInLobby(player: Human): boolean {
    if (this.playersQueue.isEmpty()) {
      return false
    }
    return this.playersQueue.toArray().indexOf(player) !== -1
  }
}
