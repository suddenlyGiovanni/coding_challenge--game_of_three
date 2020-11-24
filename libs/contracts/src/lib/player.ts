export interface PlayerSerialized {
  readonly id: PlayerID

  readonly name: string

  readonly type: 'AI' | 'HUMAN'
}

export type PlayerID<T extends string = string> = T
