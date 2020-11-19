import { Human } from '../model'

export type UUID = string

export interface IPlayersStore {
  readonly players: ReadonlyMap<UUID, Human>
  readonly size: number

  addPlayer(user: Human): void

  clear(): void

  getPlayerByID(id: UUID): undefined | Human

  isEmpty(): boolean

  removePlayerByID(id: UUID): undefined | Human
}
