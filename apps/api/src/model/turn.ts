import type { IPlayer, ITurn } from '../interfaces'

export class Turn<Player1 extends IPlayer, Player2 extends IPlayer>
  implements ITurn<Player1, Player2> {
  private currentTurn: Player1 | Player2

  private readonly player1: Player1

  private readonly player2: Player2

  private turnNumber: number

  public constructor(player1: Player1, player2: Player2) {
    this.player1 = player1
    this.player2 = player2
    this.turnNumber = 0
  }

  public getCurrent(): Player1 | Player2 {
    this.assertInt()
    return this.currentTurn
  }

  public getTurnNumber(): number {
    this.assertInt()
    return this.turnNumber
  }

  public init(): void {
    this.currentTurn = this.player1
    this.turnNumber = 1
  }

  public next(): Player1 | Player2 {
    this.assertInt()
    this.turnNumber += 1
    this.currentTurn = this.peekNext()
    return this.currentTurn
  }

  public peekNext(): Player1 | Player2 {
    this.assertInt()
    if (this.currentTurn.isSame(this.player1)) {
      return this.player2
    }
    if (this.currentTurn.isSame(this.player2)) {
      return this.player1
    }
  }

  private assertInt(): void {
    if (this.turnNumber === 0 || !this.currentTurn) {
      throw new Error(
        'Turn not initialized: remember to call init() on a newly instantiated Turn'
      )
    }
  }
}
