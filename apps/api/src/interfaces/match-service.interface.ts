import type { IPlayer } from './player.interface'

import type { IAction, IEntity } from '@game-of-three/contracts'

export interface IMatchService<
  MatchID extends string = string,
  PlayerID1 extends string = string,
  PlayerID2 extends string = string
> extends IEntity<MatchID, 'MatchService'> {
  /**
   * a game move
   * @param {IPlayer} player
   * @param {IAction} action
   * @memberof IMatchService
   */
  move(player: IPlayer<PlayerID1> | IPlayer<PlayerID2>, action: IAction): void
}
