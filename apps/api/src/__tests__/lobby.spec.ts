import { afterEach, beforeEach, describe, expect, it } from '@jest/globals'

import { Human, Lobby } from '../model'

describe('lobby', () => {
  const playerIDA = new Human('PLAYER_A_ID', 'PLAYER_A').id
  const playerIDB = new Human('PLAYER_B_ID', 'PLAYER_B').id
  const playerIDC = new Human('PLAYER_C_ID', 'PLAYER_C').id
  const playerIDD = new Human('PLAYER_D_ID', 'PLAYER_D').id

  let lobby: Lobby
  beforeEach(() => {
    lobby = Lobby.getInstance()
  })

  afterEach(() => {
    lobby.reset()
  })

  it('should create an instance of the Lobby class', () => {
    expect.hasAssertions()
    expect(lobby).not.toBeUndefined()
    expect(lobby).toBeInstanceOf(Lobby)
  })

  it('should create only an instance of the Lobby class', () => {
    expect.hasAssertions()
    expect(lobby).toBe(Lobby.getInstance())
  })

  it('should allow to reset the lobby to its initial pristine state', () => {
    expect.hasAssertions()
    expect(lobby.size).toBe(0)

    lobby.addPlayerId(playerIDA)
    lobby.addPlayerId(playerIDB)
    lobby.addPlayerId(playerIDC)
    expect(lobby.playersId).toContain(playerIDA)
    expect(lobby.playersId).toContain(playerIDB)
    expect(lobby.playersId).toContain(playerIDC)
    expect(lobby.size).toBe(3)

    // act
    lobby.reset()
    // assert
    expect(lobby.size).toBe(0)
    expect(lobby.playersId).not.toContain(playerIDA)
    expect(lobby.playersId).not.toContain(playerIDB)
    expect(lobby.playersId).not.toContain(playerIDC)
  })

  it('should allow to add a human IPlayer to the lobby', () => {
    expect.hasAssertions()
    // act
    lobby.addPlayerId(playerIDA)
    lobby.addPlayerId(playerIDB)
    lobby.addPlayerId(playerIDC)
    lobby.addPlayerId(playerIDC) // this is deliberate to check if it adds also duplicated items

    // assert
    const playersId = lobby.playersId
    expect(playersId).toContain(playerIDA)
    expect(playersId).toContain(playerIDB)
    expect(playersId).toContain(playerIDC)
    expect(playersId).toContain(playerIDA)
    expect(playersId).not.toContain(playerIDD)
    expect(playersId).toHaveLength(3)
  })

  it('should allow to remove a human IPlayer from the lobby', () => {
    expect.hasAssertions()
    // arrange
    lobby.addPlayerId(playerIDA)
    lobby.addPlayerId(playerIDB)
    lobby.addPlayerId(playerIDC)

    // act
    lobby.removePlayerId(playerIDB)
    lobby.removePlayerId(playerIDC)
    lobby.removePlayerId(playerIDD)

    // assert
    const playersId = lobby.playersId
    expect(playersId).toContain(playerIDA)
    expect(playersId).not.toContain(playerIDB)
    expect(playersId).not.toContain(playerIDC)
    expect(playersId).not.toContain(playerIDD)
    expect(playersId).toHaveLength(1)
  })

  it('should allow to get the number of human IPlayer currently in the lobby', () => {
    expect.hasAssertions()
    expect(lobby.size).toBe(0)

    lobby.addPlayerId(playerIDA)
    lobby.addPlayerId(playerIDB)
    lobby.addPlayerId(playerIDC)
    lobby.addPlayerId(playerIDD)

    expect(lobby.size).toBe(4)
  })

  it('should tell if the looby is empty', () => {
    expect.hasAssertions()
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(lobby.isEmpty).toBeDefined()
    expect(lobby.isEmpty()).toBe(true)
  })

  it('should allow to gets an array representation of all the human IPlayers currently in the lobby', () => {
    expect.hasAssertions()
    // act
    lobby.addPlayerId(playerIDA)
    lobby.addPlayerId(playerIDB)
    lobby.addPlayerId(playerIDC)
    lobby.addPlayerId(playerIDD)

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(() => lobby.playersId).not.toThrow()
    expect(Array.isArray(lobby.playersId)).toBe(true)
    expect(lobby.playersId).toContain(playerIDA)
    expect(lobby.playersId).toContain(playerIDB)
    expect(lobby.playersId).toContain(playerIDC)
    expect(lobby.playersId).toContain(playerIDD)
  })
})
