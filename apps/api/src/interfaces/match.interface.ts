import type { IMatchState } from './match-state.interface'
import type { IPlayer } from './player.interface'

import type { IEntity, IMatchStatus } from '@game-of-three/contracts'

export interface IMatch<
  IPlayer1 extends IPlayer<string>,
  IPlayer2 extends IPlayer<string>
> extends IEntity<string, 'Match'> {
  /**
   * get the match unique ID
   * @returns {string}
   * @memberof IMatch
   */
  readonly id: string

  /**
   * gets who will be playing the next turn (without setting it)
   * @returns {(IPlayer1 | IPlayer2)}
   * @memberof IMatch
   */
  readonly nextTurn: IPlayer1 | IPlayer2

  /**
   * gets a tuple of the two current players
   * @returns {readonly [IPlayer1, IPlayer2]}
   * @memberof IMatch
   */
  readonly players: readonly [IPlayer1, IPlayer2]

  /**
   * get the current match state
   * @returns {Readonly<IMatchState>}
   * @memberof IMatch
   */
  readonly state: Readonly<IMatchState>

  /**
   * gets the history of all the match states.
   * it returns an immutable array of readonly states
   * @returns {ReadonlyArray<Readonly<IMatchState>>}
   * @memberof IMatch
   */
  readonly stateHistory: ReadonlyArray<Readonly<IMatchState>>

  /**
   * gets the current match status
   * it is encoded as follows:
   * - 0 ==> 'Star' ,
   * - 1 ==> 'Playing',
   * - 2 ==> 'Stop'
   * @returns {IMatchStatus}
   * @memberof IMatch
   */
  readonly status: IMatchStatus

  /**
   * gets who is playing the current turn
   * @returns {(IPlayer1 | IPlayer2)}
   * @memberof IMatch
   */
  readonly turn: IPlayer1 | IPlayer2

  /**
   * gets the number of the current turn
   * @returns {number}
   * @memberof IMatch
   */
  readonly turnNumber: number

  /**
   * initialize the match by:
   * - generating an initial number
   * - initializing the turn
   * - ??
   * @memberof IMatch
   */
  init(): void

  /**
   * set a new match state
   * @param {IMatchState} matchState
   * @memberof IMatch
   */
  push(matchState: IMatchState): void
}
