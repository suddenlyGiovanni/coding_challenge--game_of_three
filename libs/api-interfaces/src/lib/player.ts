export interface PlayerSerialized {
  readonly id: string

  readonly name: string

  readonly state: 'PENDING' | 'WAITING' | 'PLAYING'

  readonly type: 'AI' | 'HUMAN'
}
