import type { IEntity } from './entity'

export interface PlayerSerialized<PlayerID extends string = string>
  extends IEntity<PlayerID, 'Player'> {
  readonly id: PlayerID

  readonly name: string

  readonly type: 'AI' | 'HUMAN'
}

export type PlayerID<T extends string = string> = T
