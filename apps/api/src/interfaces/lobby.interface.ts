/*
- there could only be one instance of a Lobby at the time.
- is responsible for registering connected users
- should implement the following operations: add user, remove user, start a match
*/

import type { Human } from '../model/human'

export interface ILobby {
  /**
   * gets an array representation of all the human IPlayers currently in the ILobby
   * @returns {ReadonlyArray<Readonly<Human>>}
   * @memberof ILobby
   */
  getPlayers(): ReadonlyArray<Readonly<Human>>

  /**
   * gets the number of human IPlayer currently in the ILobby
   * @returns {number}
   * @memberof ILobby
   */
  getSize(): number

  /**
   * adds a human IPlayer to the ILobby
   * @param {Human} player
   * @memberof ILobby
   */
  addPlayer(player: Human): void

  /**
   * removes a human IPlayer from the ILobby
   * @param {Human} player
   * @memberof ILobby
   */
  removePlayer(player: Human): void

  /**
   * reset the lobby to a pristine state
   * @memberof ILobby
   */
  reset(): void
}
