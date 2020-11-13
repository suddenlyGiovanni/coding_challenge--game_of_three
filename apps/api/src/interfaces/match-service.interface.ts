import type { IAction } from './match-state.interface'
import type { IPlayer } from './player.interface'

export interface IMatchService {
  /**
   * a game move
   * @param {IPlayer} player
   * @param {IAction} action
   * @memberof IMatchService
   */
  move(player: IPlayer, action: IAction): void
}
