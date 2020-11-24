import type { IPlayersStore, UUID } from './interfaces'
import type { Human } from './model'

import type { PlayerSerialized } from '@game-of-three/contracts'

export class PlayersStore implements IPlayersStore {
  private static instance: PlayersStore

  readonly _players: Map<string, Human>

  private constructor() {
    this._players = new Map<string, Human>()
  }

  public static getInstance(): PlayersStore {
    if (!this.instance) {
      this.instance = new PlayersStore()
    }
    return PlayersStore.instance
  }

  public get size(): number {
    return this._players.size
  }

  public get players(): ReadonlyMap<string, Human> {
    return this._players
  }

  public addPlayer(player: Human): void {
    if (!this._players.has(player.id)) {
      this._players.set(player.id, player)
    }
  }

  public clear(): void {
    this._players.clear()
  }

  public getPlayerByID(id: UUID): undefined | Human {
    return this._players.get(id)
  }

  public getSerializedPlayer(): PlayerSerialized[] {
    return [...this._players.values()].map((player) => player.serialize())
  }

  public isEmpty(): boolean {
    return this.size < 1
  }

  public removePlayerByID(id: UUID): undefined | Human {
    if (this._players.has(id)) {
      const user = this._players.get(id)
      this._players.delete(id)
      return user
    }
  }
}
