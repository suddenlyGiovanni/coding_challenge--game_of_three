import type { IPlayer, ITurn } from '../interfaces'

export class Turn<Player1 extends IPlayer, Player2 extends IPlayer>
  implements ITurn<Player1, Player2> {
  public readonly __type: 'Turn' = 'Turn'

  public readonly id: string

  private _current!: Player1 | Player2

  private _number: number

  private readonly _player1: Player1

  private readonly _player2: Player2

  public constructor(player1: Player1, player2: Player2, matchId: string) {
    this._player1 = player1
    this._player2 = player2
    this._number = 0
    this.id = matchId
  }

  public get current(): Player1 | Player2 {
    this.assertInt()
    return this._current
  }

  public get number(): number {
    this.assertInt()
    return this._number
  }

  public get next(): Player1 | Player2 {
    this.assertInt()
    return this._current.isSame(this._player1) ? this._player2 : this._player1
  }

  public init(): void {
    this._current = this._player1
    this._number = 1
  }

  public switch(): Player1 | Player2 {
    this.assertInt()
    this._number += 1
    this._current = this.next
    return this._current
  }

  private assertInt(): void {
    if (this._number === 0 || !this._current) {
      throw new Error(
        'Turn not initialized: remember to call `init()` on a newly instantiated Turn'
      )
    }
  }
}
