import { afterEach, beforeEach, describe, expect, it } from '@jest/globals'

import type { IPlayersStore } from '../interfaces'
import { Human } from '../model'
import { PlayersStore } from '../players-store'

import type { PlayerSerialized } from '@game-of-three/contracts'

describe('users-store', () => {
  const playerA = new Human('USER_A_ID', 'PLAYER_A')
  const playerB = new Human('USER_B_ID', 'PLAYER_B')
  const playerC = new Human('USER_C_ID')

  let playersStore: IPlayersStore
  beforeEach(() => {
    playersStore = PlayersStore.getInstance()
  })

  afterEach(() => {
    playersStore.clear()
  })

  it('should create an instance of the PlayerStore class', () => {
    expect.hasAssertions()
    expect(playersStore).not.toBeUndefined()
    expect(playersStore).toBeInstanceOf(PlayersStore)
  })

  it('should create only an instance of the PlayerStore class', () => {
    expect.hasAssertions()
    expect(playersStore).toBe(PlayersStore.getInstance())
  })

  it('should allow to reset the PlayerStore to its initial pristine state', () => {
    expect.hasAssertions()
    expect(playersStore.size).toBe(0)
    expect(playersStore.isEmpty()).toBe(true)

    playersStore.addPlayer(playerA)
    playersStore.addPlayer(playerB)
    expect(playersStore.players.has(playerA.id)).toBe(true)
    expect(playersStore.players.has(playerB.id)).toBe(true)
    expect(playersStore.size).toBe(2)

    // act
    playersStore.clear()
    // assert
    expect(playersStore.size).toBe(0)
    expect(playersStore.isEmpty()).toBe(true)
    expect(playersStore.players.has(playerA.id)).not.toBe(true)
    expect(playersStore.players.has(playerB.id)).not.toBe(true)
  })

  it('should allow to add a human IPlayer to the UsersStore', () => {
    expect.hasAssertions()
    // act
    playersStore.addPlayer(playerA)
    playersStore.addPlayer(playerB)
    playersStore.addPlayer(playerB)

    // assert
    expect(playersStore.players.has(playerA.id)).toBe(true)
    expect(playersStore.players.has(playerB.id)).toBe(true)
    expect(playersStore.size).toBe(2)
  })

  it('should not add duplicate users to the UsersStore', () => {
    expect.hasAssertions()

    // act
    playersStore.addPlayer(playerA)
    playersStore.addPlayer(playerB)
    playersStore.addPlayer(playerB)

    // assert
    expect(playersStore.size).toBe(2)
    expect(playersStore.players.has(playerA.id)).toBe(true)
    expect(playersStore.players.get(playerA.id)).toBe(playerA)
    expect(playersStore.players.has(playerB.id)).toBe(true)
    expect(playersStore.players.get(playerB.id)).toBe(playerB)
  })

  it('should allow to remove a IUser from the PlayerStore', () => {
    expect.hasAssertions()
    // arrange
    playersStore.addPlayer(playerA)
    playersStore.addPlayer(playerB)

    // act
    expect(playersStore.removePlayerByID(playerB.id)).toBe(playerB)
    expect(playersStore.removePlayerByID(playerC.id)).toBeUndefined()

    // assert
    expect(playersStore.size).toBe(1)
    expect(playersStore.players.has(playerA.id)).toBe(true)
    expect(playersStore.players.has(playerB.id)).not.toBe(true)
    expect(playersStore.players.has(playerC.id)).not.toBe(true)
  })

  it('should allow to get the number users stored', () => {
    expect.hasAssertions()
    expect(playersStore.size).toBe(0)
    expect(playersStore.isEmpty()).toBe(true)

    playersStore.addPlayer(playerA)
    playersStore.addPlayer(playerB)
    playersStore.addPlayer(playerC)

    expect(playersStore.size).toBe(3)
    expect(playersStore.isEmpty()).not.toBe(true)
  })

  it('should allow to update a user property', () => {
    expect.hasAssertions()
    // arrange
    playersStore.addPlayer(playerC)
    expect(playersStore.getPlayerByID(playerC.id).name).toBe('')

    // act
    playersStore.getPlayerByID(playerC.id).setName('PLAYER_C')

    // assert
    expect(playersStore.size).toBe(1)
    expect(playersStore.getPlayerByID(playerC.id)).toBe(playerC)
    expect(playersStore.getPlayerByID(playerC.id).name).toBe('PLAYER_C')
  })

  it('should have a method to retrieve a serialized version of the store', () => {
    expect.hasAssertions()
    let serializedStore: PlayerSerialized[]
    playersStore.addPlayer(playerA)
    playersStore.addPlayer(playerB)
    playersStore.addPlayer(playerC)
    expect(
      () => (serializedStore = playersStore.getSerializedPlayer())
    ).not.toThrow()

    expect(Array.isArray(serializedStore)).toBe(true)
    expect(serializedStore).toContainEqual(playerA.serialize())
    expect(serializedStore).toContainEqual(playerB.serialize())
    expect(serializedStore).toContainEqual(playerC.serialize())
  })
})
