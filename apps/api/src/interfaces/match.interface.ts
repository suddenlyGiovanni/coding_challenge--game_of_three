import type { IMatchState } from './match-state.interface'
import type { IPlayer } from './player.interface'

import type { IEntity, MatchStatus } from '@game-of-three/contracts'

export interface IMatch<
  PlayerID1 extends string = string,
  PlayerID2 extends string = string,
  MatchID extends string = string
> extends IEntity<MatchID, 'Match'> {
  /**
   * get the match unique ID
   * @returns {string}
   * @memberof IMatch
   */
  readonly id: MatchID

  /**
   * gets who will be playing the next turn (without setting it)
   * @returns {(PlayerID1 | PlayerID2)}
   * @memberof IMatch
   */
  readonly nextTurn: IPlayer<PlayerID1> | IPlayer<PlayerID2>

  /**
   * gets a tuple of the two current players
   * @returns {readonly [PlayerID1, PlayerID2]}
   * @memberof IMatch
   */
  readonly players: readonly [
    player1: IPlayer<PlayerID1>,
    player2: IPlayer<PlayerID2>
  ]

  /**
   * get the current match state
   * @returns {Readonly<IMatchState>}
   * @memberof IMatch
   */
  readonly state: Readonly<IMatchState<MatchID, PlayerID1, PlayerID2>>

  /**
   * gets the history of all the match states.
   * it returns an immutable array of readonly states
   * @returns {ReadonlyArray<Readonly<IMatchState>>}
   * @memberof IMatch
   */
  readonly stateHistory: ReadonlyArray<
    Readonly<IMatchState<MatchID, PlayerID1, PlayerID2>>
  >

  /**
   * gets the current match status
   * it is encoded as follows:
   * - 0 ==> 'Star' ,
   * - 1 ==> 'Playing',
   * - 2 ==> 'Stop'
   * @returns {IMatchStatus}
   * @memberof IMatch
   */
  readonly status: MatchStatus.Start | MatchStatus.Playing | MatchStatus.Stop

  /**
   * gets who is playing the current turn
   * @returns {(PlayerID1 | PlayerID2)}
   * @memberof IMatch
   */
  readonly turn: IPlayer<PlayerID1> | IPlayer<PlayerID2>

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
  push(matchState: IMatchState<MatchID, PlayerID1, PlayerID2>): void
}
