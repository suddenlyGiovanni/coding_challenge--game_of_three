export type IAI = 'AI'
export type IHUMAN = 'HUMAN'

export type IPlayerType = IAI | IHUMAN

export enum PlayerType {
  HUMAN = 'HUMAN',
  AI = 'AI',
}

export interface IPlayer {
  /**
   * gets the id of the player
   * @returns {string} id of the player
   * @memberof IPlayer
   */
  getId(): string

  /**
   * gets the name of the Player
   * @returns {string} the name of the player
   * @memberof IPlayer
   */
  getName(): string

  /**
   * get the player type
   * @returns {IPlayerType} either `AI` or `HUMAN`
   * @memberof IPlayer
   */
  getType(): IPlayerType

  /**
   * checks if the player is an `AI` or `HUMAN`
   * @returns {boolean} true if the player is an `AI`
   * @memberof IPlayer
   */
  isAi(): boolean

  /**
   * verifies if the given player is the same as the current one
   * @param {IPlayer} player
   * @returns {boolean}
   * @memberof IPlayer
   */
  isSame(player: IPlayer): boolean
}
