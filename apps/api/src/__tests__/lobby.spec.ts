import { expect, it, describe, beforeEach, afterEach } from '@jest/globals'

import { Lobby } from '../model/lobby'
import { Human } from '../model/human'

import type { ILobby } from '../interfaces'

describe('Lobby', () => {
  const playerA = new Human('PLAYER_A_ID', 'PLAYER_A')
  const playerB = new Human('PLAYER_B_ID', 'PLAYER_B')
  const playerC = new Human('PLAYER_C_ID', 'PLAYER_C')
  const playerD = new Human('PLAYER_D_ID', 'PLAYER_D')

  let lobby: ILobby
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
    expect(lobby.getSize()).toBe(0)

    lobby.addPlayer(playerA)
    lobby.addPlayer(playerB)
    lobby.addPlayer(playerC)
    expect(lobby.getPlayers()).toContain(playerA)
    expect(lobby.getPlayers()).toContain(playerB)
    expect(lobby.getPlayers()).toContain(playerC)
    expect(lobby.getSize()).toBe(3)

    // act
    lobby.reset()
    // assert
    expect(lobby.getSize()).toBe(0)
    expect(lobby.getPlayers()).not.toContain(playerA)
    expect(lobby.getPlayers()).not.toContain(playerB)
    expect(lobby.getPlayers()).not.toContain(playerC)
  })

  it('should allow to add a human IPlayer to the lobby', () => {
    expect.hasAssertions()
    // act
    lobby.addPlayer(playerA)
    lobby.addPlayer(playerB)
    lobby.addPlayer(playerC)
    lobby.addPlayer(playerC) // this is deliberate to check if it adds also duplicated items

    // assert
    const players = lobby.getPlayers()
    expect(players).toContain(playerA)
    expect(players).toContain(playerB)
    expect(players).toContain(playerC)
    expect(players).toContain(playerA)
    expect(players).not.toContain(playerD)
    expect(players.length).toBe(3)
  })

  it('should allow to remove a human IPlayer from the lobby', () => {
    expect.hasAssertions()
    // arrange
    lobby.addPlayer(playerA)
    lobby.addPlayer(playerB)
    lobby.addPlayer(playerC)

    // act
    lobby.removePlayer(playerB)
    lobby.removePlayer(playerC)
    lobby.removePlayer(playerD)

    // assert
    const players = lobby.getPlayers()
    expect(players).toContain(playerA)
    expect(players).not.toContain(playerB)
    expect(players).not.toContain(playerC)
    expect(players).not.toContain(playerD)
    expect(players.length).toBe(1)
  })

  it('should allow to get the number of human IPlayer currently in the lobby', () => {
    expect.hasAssertions()
    expect(lobby.getSize()).toBe(0)

    lobby.addPlayer(playerA)
    lobby.addPlayer(playerB)
    lobby.addPlayer(playerC)
    lobby.addPlayer(playerD)

    expect(lobby.getSize()).toBe(4)
  })

  it('should allow to gets an array representation of all the human IPlayers currently in the lobby', () => {
    expect.hasAssertions()
    // act
    lobby.addPlayer(playerA)
    lobby.addPlayer(playerB)
    lobby.addPlayer(playerC)
    lobby.addPlayer(playerD)

    expect(lobby.getPlayers).toBeDefined()
    expect(Array.isArray(lobby.getPlayers())).toBe(true)
    expect(lobby.getPlayers()).toContain(playerA)
    expect(lobby.getPlayers()).toContain(playerB)
    expect(lobby.getPlayers()).toContain(playerC)
    expect(lobby.getPlayers()).toContain(playerD)
  })
})
