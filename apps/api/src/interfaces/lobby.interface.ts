import { PlayerID } from '@game-of-three/contracts'

export interface ILobby {
  /**
   * gets an array representation of all the human PlayerIDs currently in the ILobby
   * @returns {ReadonlyArray<Readonly<PlayerID>>}
   * @memberof ILobby
   */
  readonly playersId: ReadonlyArray<Readonly<PlayerID>>

  /**
   * gets the number of human PlayerID currently in the ILobby
   * @returns {number}
   * @memberof ILobby
   */
  readonly size: number

  /**
   * adds a human PlayerID to the ILobby
   * @param {PlayerID} playerId
   * @memberof ILobby
   */
  addPlayerId(playerId: PlayerID): void

  /**
   * gets the next player waiting in the queue
   * @returns {(undefined | PlayerID)}
   * @memberof ILobby
   */
  getNextPlayerId(): undefined | PlayerID

  /**
   * returns true if the lobby is empty
   * @returns {boolean}
   * @memberof ILobby
   */
  isEmpty(): boolean

  /**
   * removes a human PlayerID from the ILobby
   * @param {PlayerID} playerId
   * @memberof ILobby
   */
  removePlayerId(playerId: PlayerID): void

  /**
   * reset the lobby to a pristine state
   * @memberof ILobby
   */
  reset(): void
}
