import type { IMatchState } from './match-state.interface'
import type { IPlayer } from './player.interface'
import type { ITurn } from './turn.interface'

export interface IMatch<
  IPlayer1 extends IPlayer<string>,
  IPlayer2 extends IPlayer<string>
> {
  /**
   * gets who is playing the current turn
   * @returns {(IPlayer1 | IPlayer2)}
   * @memberof IMatch
   */
  getCurrentTurn(): IPlayer1 | IPlayer2

  /**
   * gets the number of the current turn
   * @returns {number}
   * @memberof IMatch
   */
  getCurrentTurnNumber(): number

  /**
   * gets the history of all the match states.
   * it returns an immutable array of readonly states
   * @returns {ReadonlyArray<Readonly<IMatchState<string, string>>>}
   * @memberof IMatch
   */
  getMatchStateHistory(): ReadonlyArray<Readonly<IMatchState<string, string>>>

  /**
   * gets a tuple of the two current players
   * @returns {readonly [IPlayer1, IPlayer2]}
   * @memberof IMatch
   */
  getPlayers(): readonly [IPlayer1, IPlayer2]

  /**
   * initialize the match by:
   * - generating an initial number
   * - initializing the turn
   * - ??
   * @memberof IMatch
   */
  init(): void

  move(action: -1 | 0 | 1): void

  /**
   * gets who will be playing the next turn (without setting it)
   * @returns {(IPlayer1 | IPlayer2)}
   * @memberof IMatch
   */
  peekNextTurn(): IPlayer1 | IPlayer2
}
