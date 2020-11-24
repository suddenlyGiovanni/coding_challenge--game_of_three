import type { Human } from '../model'

import type { PlayerSerialized } from '@game-of-three/contracts'

export type UUID = string

export interface IPlayersStore {
  readonly players: ReadonlyMap<UUID, Human>
  readonly size: number

  addPlayer(user: Human): void

  clear(): void

  getPlayerByID(id: UUID): undefined | Human

  getSerializedPlayer(): PlayerSerialized[]

  isEmpty(): boolean

  removePlayerByID(id: UUID): undefined | Human
}
