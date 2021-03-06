import type { AI } from '../model/ai'

import type { IEntity, IPlayerEntity } from '@game-of-three/contracts'

export type IAI = 'AI'
export type IHUMAN = 'HUMAN'

export type IPlayerType = IAI | IHUMAN

export enum PlayerType {
  HUMAN = 'HUMAN',
  AI = 'AI',
}

export interface IPlayer<PlayerID extends string = string>
  extends IEntity<PlayerID, 'Player'> {
  /**
   * gets the id of the player
   * @type {PlayerID}
   * @memberof IPlayer
   */
  readonly id: PlayerID

  /**
   * gets the name of the Player
   * @returns {string} the name of the player
   * @memberof IPlayer
   */
  readonly name: string

  /**
   * get the player type
   * @returns {IPlayerType} either `AI` or `HUMAN`
   * @memberof IPlayer
   */
  readonly type: IPlayerType

  /**
   * checks if the player is an `AI` or `HUMAN`
   * @returns {boolean} true if the player is an `AI`
   * @memberof IPlayer
   */
  isAi(): this is AI<PlayerID>

  /**
   * verifies if the given player is the same as the current one
   * @param {IPlayer<PlayerID>} player
   * @returns {boolean}
   * @memberof IPlayer
   */
  isSame(player: IPlayer): boolean

  serialize(): IPlayerEntity<PlayerID>
}
