export interface PlayerSerialized {
  readonly id: string

  readonly name: string

  readonly type: 'AI' | 'HUMAN'
}
