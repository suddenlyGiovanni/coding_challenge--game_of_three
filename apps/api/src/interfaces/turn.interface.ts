import type { IPlayer } from './player.interface'

import type { IEntity } from '@game-of-three/contracts'

export interface ITurn<
  MatchID extends string = string,
  PlayerID1 extends string = string,
  PlayerID2 extends string = string
> extends IEntity<MatchID, 'Turn'> {
  /**
   * who is playing the current turn
   * @type {(PlayerID1 | Player2)}
   * @memberof ITurn
   */
  readonly current: IPlayer<PlayerID1> | IPlayer<PlayerID2>

  /**
   * who will be playing the next turn (without setting it)
   * @type {(PlayerID1 | Player2)}
   * @memberof ITurn
   */
  readonly next: IPlayer<PlayerID1> | IPlayer<PlayerID2>

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
   * @returns {(PlayerID1 | Player2)}
   * @memberof ITurn
   */
  switch(): IPlayer<PlayerID1> | IPlayer<PlayerID2>
}
