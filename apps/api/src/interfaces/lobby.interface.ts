/*
- there could only be one instance of a Lobby at the time.
- is responsible for registering connected users
- should implement the following operations: add user, remove user, start a match
*/

import { PlayerID } from '@game-of-three/contracts'

export interface ILobby {
  /**
   * adds a human PlayerID to the ILobby
   * @param {PlayerID} playerId
   * @memberof ILobby
   */
  addPlayerId(playerId: PlayerID): void

  /**
   * gets an array representation of all the human PlayerIDs currently in the ILobby
   * @returns {ReadonlyArray<Readonly<PlayerID>>}
   * @memberof ILobby
   */
  getPlayersId(): ReadonlyArray<Readonly<PlayerID>>

  /**
   * gets the number of human PlayerID currently in the ILobby
   * @returns {number}
   * @memberof ILobby
   */
  getSize(): number

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
