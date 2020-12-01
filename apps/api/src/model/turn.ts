import type { IPlayer, ITurn } from '../interfaces'

export class Turn<
  MatchID extends string = string,
  PlayerID1 extends string = string,
  PlayerID2 extends string = string
> implements ITurn<MatchID, PlayerID1, PlayerID2> {
  public readonly __type: 'Turn' = 'Turn'

  public readonly id: MatchID

  private _current!: IPlayer<PlayerID1> | IPlayer<PlayerID2>

  private _number: number

  private readonly _player1: IPlayer<PlayerID1>

  private readonly _player2: IPlayer<PlayerID2>

  public constructor(
    player1: IPlayer<PlayerID1>,
    player2: IPlayer<PlayerID2>,
    matchId: MatchID
  ) {
    this._player1 = player1
    this._player2 = player2
    this._number = 0
    this.id = matchId
  }

  public get current(): IPlayer<PlayerID1> | IPlayer<PlayerID2> {
    this.assertInt()
    return this._current
  }

  public get number(): number {
    this.assertInt()
    return this._number
  }

  public get next(): IPlayer<PlayerID1> | IPlayer<PlayerID2> {
    this.assertInt()
    return this._current.isSame(this._player1) ? this._player2 : this._player1
  }

  public init(): void {
    this._current = this._player1
    this._number = 1
  }

  public switch(): IPlayer<PlayerID1> | IPlayer<PlayerID2> {
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
