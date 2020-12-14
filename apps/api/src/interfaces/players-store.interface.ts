import type { Human } from '../model'

import type { IPlayerEntity } from '@game-of-three/contracts'

export type UUID = string

export interface IPlayersStore {
  readonly players: ReadonlyMap<UUID, Human>
  readonly size: number

  addPlayer(user: Human): void

  clear(): void

  getPlayerByID(id: UUID): undefined | Human

  getSerializedPlayer(): IPlayerEntity[]

  isEmpty(): boolean

  removePlayerByID(id: UUID): undefined | Human
}
