import type { IPlayer } from './player.interface'

export interface ITurn<
  Player1 extends IPlayer = IPlayer,
  Player2 extends IPlayer = IPlayer
> {
  /**
   * who is playing the current turn
   * @type {(Player1 | Player2)}
   * @memberof ITurn
   */
  readonly current: Player1 | Player2

  /**
   * who will be playing the next turn (without setting it)
   * @type {(Player1 | Player2)}
   * @memberof ITurn
   */
  readonly next: Player1 | Player2

  /**
   * the number of the current turn
   * @type {number}
   * @memberof ITurn
   */
  readonly number: number

  /**
   * initialize the state by
   * - setting the currentTurn to Player1
   * - setting the turnNumber to 1
   * @memberof ITurn
   */
  init(): void

  /**
   * switch turn and then returns who's turn is
   * @returns {(Player1 | Player2)}
   * @memberof ITurn
   */
  switch(): Player1 | Player2
}
