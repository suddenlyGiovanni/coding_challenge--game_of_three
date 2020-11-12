/* eslint-disable jest/no-hooks */
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals'

import type { IMatchState, IObserver } from '../interfaces'
import { MatchStatus } from '../interfaces'
import { AI } from '../model/ai'
import { Human } from '../model/human'
import { Match, NumberGeneratorStrategy } from '../model/match'

describe('match', () => {
  const PLAYER_1_ID = 'ID_HUMAN'
  const PLAYER_1_NAME = 'NAME_HUMAN'
  const PLAYER_2_ID = 'ID_AI'

  const human = new Human(PLAYER_1_ID, PLAYER_1_NAME)
  const ai = AI.make(() => PLAYER_2_ID)

  let match: Match<typeof human, typeof ai>

  const numberGeneratorStrategy: NumberGeneratorStrategy = () => 100
  const mockNumberGeneratorStrategy = jest.fn(numberGeneratorStrategy)

  beforeEach(() => {
    match = new Match(human, ai, mockNumberGeneratorStrategy)
  })

  afterEach(() => {
    mockNumberGeneratorStrategy.mockClear()
  })

  it('should exist', () => {
    expect.hasAssertions()
    expect(Match).toBeDefined()
  })

  it('should instantiate correctly', () => {
    expect.hasAssertions()
    const INITIALIZATION_ERROR_MESSAGE =
      'Match not initialize. Remember to invoke `init()` after instantiation.'
    expect(match).toBeInstanceOf(Match)
    expect(match).not.toBe(new Match(human, ai))
    expect(() => match.getPlayers()).not.toThrow()
    expect(() => match.getCurrentTurn()).toThrow(INITIALIZATION_ERROR_MESSAGE)
    expect(() => match.getCurrentTurnNumber()).toThrow(
      INITIALIZATION_ERROR_MESSAGE
    )
    expect(() => match.getMatchStateHistory()).toThrow(
      INITIALIZATION_ERROR_MESSAGE
    )
    expect(() => match.peekNextTurn()).toThrow(INITIALIZATION_ERROR_MESSAGE)
  })

  it('defaultNumberGeneratorStrategy should work correctly', () => {
    expect.hasAssertions()
    const positiveInteger = Match.defaultNumberGeneratorStrategy(
      Match.MIN,
      Match.MAX
    )
    expect(Number.isInteger(positiveInteger)).toBe(true)
    expect(positiveInteger).toBeGreaterThanOrEqual(Match.MIN)
    expect(positiveInteger).toBeLessThanOrEqual(Match.MAX)
  })

  it('should initialize', () => {
    expect.hasAssertions()
    // act
    match.init()

    // assert
    expect(match.getPlayers()).toMatchObject([human, ai])
    expect(mockNumberGeneratorStrategy).toHaveBeenCalledTimes(1)
    expect(match.getMatchStateHistory()[0].inputNumber).toBe(
      numberGeneratorStrategy()
    )
    expect(() => match.getMatchStateHistory()).not.toThrow()
    expect(() => match.getCurrentTurnNumber()).not.toThrow()
    expect(match.getCurrentTurnNumber()).toBe(1)
    expect(() => match.getCurrentTurn()).not.toThrow()
    expect(() => match.peekNextTurn()).not.toThrow()
    expect(match.getCurrentTurn()).toBe(human)
    expect(match.peekNextTurn()).toBe(ai)

    expect(() => match.init()).toThrow(
      "Match already initialized. Can't re-initialize the Match"
    )
  })

  it('should get the players in the match', () => {
    expect.hasAssertions()
    expect(match.getPlayers()).toHaveLength(2)
    expect(match.getPlayers()[0]).toBe(human)
    expect(match.getPlayers()[1]).toBe(ai)
  })

  it('should get the currently active player', () => {
    expect.hasAssertions()
    match.init()
    expect(match.getCurrentTurn()).toBe(human)
    // TODO: check the who's turn is after a move has been issued
  })

  it('should get the current turn number', () => {
    expect.hasAssertions()
    match.init()
    expect(match.getCurrentTurnNumber()).toBe(1)
    // TODO: check the new turn number after a move has been issued
  })

  it('should gets who will be playing the next turn (without setting it)', () => {
    expect.hasAssertions()
    match.init()
    expect(match.peekNextTurn()).toBe(ai)
    // TODO: check the who's gonna be the next turn after a move has been issued
  })

  it('should get the history of all the match states', () => {
    expect.hasAssertions()
    match.init()
    expect(Array.isArray(match.getMatchStateHistory())).toBe(true)
    expect(match.getMatchStateHistory()).toHaveLength(1)
    expect(match.getMatchStateHistory()).toMatchObject([
      {
        inputNumber: numberGeneratorStrategy(),
        status: MatchStatus.Start,
        turn: human.getId(),
        turnNumber: 1,
      },
    ])
  })

  describe('move', () => {
    it('should stop the match if the output value of a move is not a positive integer', () => {
      expect.hasAssertions()
      const matchMove = new Match(human, ai, () => 0)
      const [player1, player2] = match.getPlayers()
      matchMove.init()

      matchMove.move(-1)
      expect(matchMove.getMatchStatus()).toBe(MatchStatus.Stop)
      expect(matchMove.getMatchStateHistory()).toMatchObject([
        {
          inputNumber: 0,
          status: MatchStatus.Start,
          turn: player1.getId(),
          turnNumber: 1,
        },
        {
          action: -1,
          status: MatchStatus.Stop,
          turn: player1.getId(),
          turnNumber: 1,
          winningPlayer: player2.getId(),
        },
      ])
    })

    it('should stop the match if output value of a move not divisible by three', () => {
      expect.hasAssertions()
      const matchMove = new Match(human, ai, () => 18)
      const [player1, player2] = match.getPlayers()
      matchMove.init()

      matchMove.move(1)
      expect(matchMove.getMatchStatus()).toBe(MatchStatus.Stop)
      expect(matchMove.getMatchStateHistory()).toMatchObject([
        {
          inputNumber: 18,
          status: MatchStatus.Start,
          turn: player1.getId(),
          turnNumber: 1,
        },
        {
          action: 1,
          status: MatchStatus.Stop,
          turn: player1.getId(),
          turnNumber: 1,
          winningPlayer: player2.getId(),
        },
      ])
    })

    it('should stop the match if output value of a move  is equal to one', () => {
      expect.hasAssertions()
      const matchMove = new Match(human, ai, () => 3)
      const [player1, player2] = match.getPlayers()
      matchMove.init()

      matchMove.move(0)
      expect(matchMove.getMatchStatus()).toBe(MatchStatus.Stop)
      expect(matchMove.getMatchStateHistory()).toMatchObject([
        {
          inputNumber: 3,
          status: MatchStatus.Start,
          turn: player1.getId(),
          turnNumber: 1,
        },
        {
          action: 0,
          inputNumber: 3,
          outputNumber: 1,
          status: MatchStatus.Stop,
          turn: player1.getId(),
          turnNumber: 1,
          winningPlayer: player1.getId(),
        },
      ])
    })

    it('should carry on to the next turn if the output value of a move is divisible by three', () => {
      expect.hasAssertions()
      // arrange
      const initialValue = numberGeneratorStrategy()
      const [player1, player2] = match.getPlayers()
      match.init()
      expect(match.getMatchStateHistory()).toHaveLength(1)
      expect(match.getMatchState().inputNumber).toBe(initialValue) // 100
      expect(match.getCurrentTurn()).toBe(player1)

      /* TURN 1: PLAYER 1  MOVING */
      // act
      match.move(-1)
      // assert:
      expect(match.getMatchStateHistory()).toHaveLength(2)
      expect(match.getMatchStateHistory()).toMatchObject([
        {
          inputNumber: initialValue,
          status: MatchStatus.Start,
          turn: player1.getId(),
          turnNumber: 1,
        },
        {
          action: -1,
          inputNumber: initialValue,
          outputNumber: 33,
          status: MatchStatus.Playing,
          turn: player2.getId(),
          turnNumber: 2,
        },
      ])

      /* TURN 2: PLAYER 2 MOVING */
      // act
      match.move(0)
      // assert
      expect(match.getMatchStateHistory()).toHaveLength(3)
      expect(match.getMatchStateHistory()).toMatchObject([
        {
          inputNumber: initialValue,
          status: MatchStatus.Start,
          turn: player1.getId(),
          turnNumber: 1,
        },
        {
          action: -1,
          inputNumber: initialValue,
          outputNumber: 33,
          status: MatchStatus.Playing,
          turn: player2.getId(),
          turnNumber: 2,
        },
        {
          action: 0,
          inputNumber: 33,
          outputNumber: 11,
          status: MatchStatus.Stop,
          turn: player2.getId(),
          turnNumber: 2,
          winningPlayer: player1.getId(),
        },
      ])

      expect(() => match.move(0)).toThrow(
        "Match ended. Can't make a move after a match has ended"
      )
    })
  })

  describe('observer pattern', () => {
    let matchWithObserver: Match<Human<'ID_HUMAN'>, AI<string>>
    const mockUpdateA = jest.fn()
    const mockUpdateB = jest.fn()
    const observerA: IObserver<IMatchState> = { update: mockUpdateA }
    const observerB: IObserver<IMatchState> = { update: mockUpdateB }

    beforeEach(() => {
      matchWithObserver = new Match(human, ai, () => 100)
    })

    afterEach(() => {
      // eslint-disable-next-line @typescript-eslint/unbound-method
      mockUpdateA.mockClear
      // eslint-disable-next-line @typescript-eslint/unbound-method
      mockUpdateB.mockClear
    })

    it('should implement the ISubject interface', () => {
      expect.hasAssertions()
      expect(matchWithObserver).toHaveProperty('registerObserver')
      expect(matchWithObserver).toHaveProperty('removeObserver')
      expect(matchWithObserver).toHaveProperty('notifyObservers')
    })

    it('should allow to register many observers', () => {
      expect.hasAssertions()
      expect(matchWithObserver['observers']).toHaveLength(0)
      // act
      expect(() => matchWithObserver.registerObserver(observerA)).not.toThrow()
      expect(() => matchWithObserver.registerObserver(observerB)).not.toThrow()
      // assert
      expect(matchWithObserver['observers']).toHaveLength(2)
      expect(matchWithObserver['observers']).toContain(observerA)
      expect(matchWithObserver['observers']).toContain(observerB)
      expect(mockUpdateA).toHaveBeenCalledTimes(0)
      expect(mockUpdateB).toHaveBeenCalledTimes(0)
    })

    it('should allow to remove an observer', () => {
      expect.hasAssertions()
      // arrange
      expect(matchWithObserver['observers']).toHaveLength(0)
      matchWithObserver.registerObserver(observerA)
      matchWithObserver.registerObserver(observerB)
      expect(matchWithObserver['observers']).toHaveLength(2)
      // act
      expect(() => matchWithObserver.removeObserver(observerA)).not.toThrow()
      // assert
      expect(matchWithObserver['observers']).toHaveLength(1)
      expect(matchWithObserver['observers']).toContain(observerB)
      expect(matchWithObserver['observers']).not.toContain(observerA)
      expect(mockUpdateA).toHaveBeenCalledTimes(0)
      expect(mockUpdateB).toHaveBeenCalledTimes(0)
    })

    it('should notify all observer', () => {
      expect.hasAssertions()
      // arrange
      matchWithObserver.registerObserver(observerA)
      matchWithObserver.registerObserver(observerB)
      matchWithObserver.init()
      // act
      expect(() => matchWithObserver.notifyObservers()).not.toThrow()
      // assert
      const expectedUpdateArgument = {
        inputNumber: 100,
        status: MatchStatus.Start,
        turn: human.getId(),
        turnNumber: 1,
      }
      expect(mockUpdateA).toHaveBeenCalledTimes(1)
      expect(mockUpdateA).toHaveBeenCalledWith(expectedUpdateArgument)
      expect(mockUpdateB).toHaveBeenCalledTimes(1)
      expect(mockUpdateB).toHaveBeenCalledWith(expectedUpdateArgument)
    })
  })
})
