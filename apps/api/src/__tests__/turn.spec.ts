import { expect, it, describe, beforeEach } from '@jest/globals'

import { Turn } from '../model/turn'
import { Human } from '../model/human'

import type { IPlayer, ITurn } from '../interfaces'

describe('Turn', () => {
  let player1: IPlayer
  let player2: IPlayer
  let turn: ITurn

  beforeEach(() => {
    player1 = new Human('PLAYER_1_ID', 'PLAYER_1_NAME')
    player2 = new Human('PLAYER_2_ID', 'PLAYER_2_NAME')
    turn = new Turn(player1, player2)
  })

  it('should exist', () => {
    expect.hasAssertions()
    expect(Turn).toBeDefined()
  })

  it('should instantiate correctly', () => {
    const turn = new Turn(player1, player2)
    expect.hasAssertions()
    expect(turn).toBeInstanceOf(Turn)
  })

  it('should initialize correctly', () => {
    expect.hasAssertions()
    expect(() => turn.getCurrent()).toThrow()
    expect(() => turn.getTurnNumber()).toThrow()
    expect(() => turn.peekNext()).toThrow()
    expect(() => turn.next()).toThrow()

    // act
    turn.init()

    // assert
    expect(() => turn.getCurrent()).not.toThrow()
    expect(() => turn.getTurnNumber()).not.toThrow()
    expect(() => turn.peekNext()).not.toThrow()
    expect(() => turn.next()).not.toThrow()
  })

  it('should initialize with `turnNumber` equal to `1`', () => {
    expect.hasAssertions()
    turn.init()
    expect(turn.getTurnNumber()).toBe(1)
  })

  it('should initialize with `currentPlayer` equal to `player1`', () => {
    expect.hasAssertions()
    turn.init()
    expect(turn.getCurrent()).toEqual(player1)
    expect(turn.getCurrent().isSame(player1)).toBe(true)
  })

  it('should return the Player whose turn is currently active when `getCurrent` method is invoked', () => {
    turn.init()
    expect.hasAssertions()
    expect(turn.getCurrent()).toEqual(player1)
    expect(turn.getCurrent().isSame(player2)).not.toBe(true)
  })

  it('should return the Player whose turn  will be active next when `peekNext` method is invoked', () => {
    turn.init()
    expect.hasAssertions()
    expect(turn.peekNext()).toEqual(player2)
    expect(turn.peekNext().isSame(player2)).toBe(true)
  })

  it('should get the `number` of turns so far when `getTurnNumber` method is invoked', () => {
    expect.hasAssertions()
    turn.init()
    expect(turn.getTurnNumber()).toBe(1)
    for (
      let currentTurnNumber = 2;
      currentTurnNumber <= 4;
      currentTurnNumber++
    ) {
      turn.next()
      expect(turn.getTurnNumber()).toBe(currentTurnNumber)
    }
  })

  it("should switch turn when `next` is invoked and return who's turn is", () => {
    expect.hasAssertions()
    turn.init()
    for (let i = turn.getTurnNumber(); i < 10; i++) {
      const currentTurn = turn.next()
      expect(turn.getTurnNumber()).toBe(i + 1)
      expect(currentTurn).toEqual((i + 1) % 2 === 0 ? player2 : player1)
    }
  })
})