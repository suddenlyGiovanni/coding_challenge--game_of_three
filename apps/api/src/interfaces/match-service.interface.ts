import type { IPlayer } from './player.interface'

import type { IAction } from '@game-of-three/contracts'

export interface IMatchService {
  /**
   * a game move
   * @param {IPlayer} player
   * @param {IAction} action
   * @memberof IMatchService
   */
  move(player: IPlayer, action: IAction): void
}
