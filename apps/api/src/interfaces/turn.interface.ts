import type { IPlayer } from './player.interface'

export interface ITurn<
  Player1 extends IPlayer = IPlayer,
  Player2 extends IPlayer = IPlayer
> {
  /**
   * initialize the state by
   * - setting the currentTurn to Player1
   * - setting the turnNumber to 1
   * @memberof ITurn
   */
  init(): void

  /**
   * gets the number of the current turn
   * @returns {number}
   * @memberof ITurn
   */
  getTurnNumber(): number

  /**
   * gets who is playing the current turn
   * @returns {(Player1 | Player2)}
   * @memberof ITurn
   */
  getCurrent(): Player1 | Player2

  /**
   * gets who will be playing the next turn (without setting it)
   * @returns {(Player1 | Player2)}
   * @memberof ITurn
   */
  peekNext(): Player1 | Player2

  /**
   * switch turn and then returns who's turn is
   * @returns {(Player1 | Player2)}
   * @memberof ITurn
   */
  next(): Player1 | Player2
}
