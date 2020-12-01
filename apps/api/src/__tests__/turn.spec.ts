import { beforeEach, describe, expect, it } from '@jest/globals'

import type { IPlayer, ITurn } from '../interfaces'
import { Human, Turn } from '../model'

describe('turn', () => {
  let player1: IPlayer
  let player2: IPlayer
  let turn: ITurn

  const matchId = '42'

  beforeEach(() => {
    player1 = new Human('PLAYER_1_ID', 'PLAYER_1_NAME')
    player2 = new Human('PLAYER_2_ID', 'PLAYER_2_NAME')
    turn = new Turn(player1, player2, matchId)
  })

  it('should exist', () => {
    expect.hasAssertions()
    expect(Turn).toBeDefined()
  })

  it('should instantiate correctly', () => {
    expect.hasAssertions()
    const turn = new Turn(player1, player2, matchId)
    expect(turn).toBeInstanceOf(Turn)
  })

  it('should initialize correctly', () => {
    expect.hasAssertions()

    expect(() => turn.current).toThrow(
      'Turn not initialized: remember to call `init()` on a newly instantiated Turn'
    )

    expect(() => turn.number).toThrow(
      'Turn not initialized: remember to call `init()` on a newly instantiated Turn'
    )
    expect(() => turn.next).toThrow(
      'Turn not initialized: remember to call `init()` on a newly instantiated Turn'
    )
    expect(() => turn.switch()).toThrow(
      'Turn not initialized: remember to call `init()` on a newly instantiated Turn'
    )

    // act
    turn.init()

    // assert
    expect(() => turn.current).not.toThrow()
    expect(() => turn.number).not.toThrow()
    expect(() => turn.next).not.toThrow()
    expect(() => turn.switch()).not.toThrow()
  })

  it('should initialize with `turnNumber` equal to `1`', () => {
    expect.hasAssertions()
    turn.init()
    expect(turn.number).toBe(1)
  })

  it('should initialize with `currentPlayer` equal to `player1`', () => {
    expect.hasAssertions()
    turn.init()
    // eslint-disable-next-line jest/prefer-strict-equal
    expect(turn.current).toEqual(player1)
    expect(turn.current.isSame(player1)).toBe(true)
  })

  it('should return the Player whose turn is currently active when `getCurrent` method is invoked', () => {
    expect.hasAssertions()
    turn.init()
    // eslint-disable-next-line jest/prefer-strict-equal
    expect(turn.current).toEqual(player1)
    expect(turn.current.isSame(player2)).not.toBe(true)
  })

  it('should return the Player whose turn will be active next when `peekNext` method is invoked', () => {
    expect.hasAssertions()
    turn.init()
    // eslint-disable-next-line jest/prefer-strict-equal
    expect(turn.next).toEqual(player2)
    expect(turn.next.isSame(player2)).toBe(true)
  })

  it('should get the `number` of turns so far when `getTurnNumber` method is invoked', () => {
    expect.hasAssertions()
    turn.init()
    expect(turn.number).toBe(1)
    for (
      let currentTurnNumber = 2;
      currentTurnNumber <= 4;
      currentTurnNumber++
    ) {
      turn.switch()
      expect(turn.number).toBe(currentTurnNumber)
    }
  })

  it("should switch turn when `next` is invoked and return who's turn is", () => {
    expect.hasAssertions()
    turn.init()
    for (let i = turn.number; i < 10; i++) {
      const currentTurn = turn.switch()
      expect(turn.number).toBe(i + 1)
      // eslint-disable-next-line jest/prefer-strict-equal
      expect(currentTurn).toEqual((i + 1) % 2 === 0 ? player2 : player1)
    }
  })
})
