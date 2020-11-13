import type { IMatchState, IMatchStatus } from './match-state.interface'
import type { IPlayer } from './player.interface'

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
   * get the match unique ID
   * @returns {string}
   * @memberof IMatch
   */
  getId(): string

  /**
   * get the current match state
   * @returns {Readonly<IMatchState>}
   * @memberof IMatch
   */
  getMatchState(): Readonly<IMatchState>

  /**
   * gets the history of all the match states.
   * it returns an immutable array of readonly states
   * @returns {ReadonlyArray<Readonly<IMatchState>>}
   * @memberof IMatch
   */
  getMatchStateHistory(): ReadonlyArray<Readonly<IMatchState>>

  /**
   * gets the current match status
   * it is encoded as follows:
   * - 0 ==> 'Star' ,
   * - 1 ==> 'Playing',
   * - 2 ==> 'Stop'
   * @returns {IMatchStatus}
   * @memberof IMatch
   */
  getMatchStatus(): IMatchStatus

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

  /**
   * gets who will be playing the next turn (without setting it)
   * @returns {(IPlayer1 | IPlayer2)}
   * @memberof IMatch
   */
  peekNextTurn(): IPlayer1 | IPlayer2

  /**
   * set a new match state
   * @param {IMatchState} matchState
   * @memberof IMatch
   */
  setMatchState(matchState: IMatchState): void
}
