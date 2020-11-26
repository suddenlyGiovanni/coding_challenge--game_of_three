export interface PlayerSerialized<PlayerID extends string = string> {
  readonly id: PlayerID

  readonly name: string

  readonly type: 'AI' | 'HUMAN'
}

export type PlayerID<T extends string = string> = T
