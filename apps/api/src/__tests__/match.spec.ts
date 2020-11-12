/* eslint-disable jest/no-hooks */
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals'

import type {
  IMatchState,
  IMatchStateSerialized,
  IMatchStateStartSerialized,
  IObserver,
} from '../interfaces'
import { AI } from '../model/ai'
import { Human } from '../model/human'
import { Match, NumberGeneratorStrategy } from '../model/match'
import { MatchState, MatchStatus } from '../model/match-state'

describe('match', () => {
  const PLAYER_1_ID = 'ID_HUMAN'
  const PLAYER_1_NAME = 'NAME_HUMAN'
  const PLAYER_2_ID = 'ID_AI'

  const human = new Human(PLAYER_1_ID, PLAYER_1_NAME)
  const ai = AI.make(() => PLAYER_2_ID)

  let match: Match<typeof human, typeof ai>

  const numberGeneratorStrategy: NumberGeneratorStrategy = () => 100

  const mockNumberGeneratorStrategy = jest.fn(numberGeneratorStrategy)
  const mockUpdateA = jest.fn()
  const mockUpdateB = jest.fn()

  const observerA: IObserver<IMatchStateSerialized> = { update: mockUpdateA }
  const observerB: IObserver<IMatchStateSerialized> = { update: mockUpdateB }

  beforeEach(() => {
    match = new Match(human, ai, mockNumberGeneratorStrategy)
  })

  afterEach(() => {
    mockNumberGeneratorStrategy.mockClear()
    mockUpdateA.mockClear()
    mockUpdateB.mockClear()
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
    expect(match.getMatchStateHistory()[0].outputNumber).toBe(
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
        nextTurn: human,
        outputNumber: numberGeneratorStrategy(),
        status: MatchStatus.Start,
        turnNumber: 0,
      },
    ])
  })

  it('should allow to set an new state to the match state history', () => {
    expect.hasAssertions()
    // arrange
    match.init()
    match.registerObserver(observerA)
    const [player1, player2] = match.getPlayers()
    const initialMatchState: IMatchState = new MatchState({
      nextTurn: player1,
      outputNumber: 100,
      status: MatchStatus.Start,
      turnNumber: 0,
    })
    const injectedMatchState: IMatchState = new MatchState({
      action: -1,
      currentTurn: player1,
      inputNumber: 100,
      nextTurn: player2,
      outputNumber: 33,
      status: MatchStatus.Playing,
      turnNumber: 1,
    })
    expect(match.getMatchState()).toStrictEqual(initialMatchState)
    // act
    expect(() => match.setMatchState(injectedMatchState)).not.toThrow()
    // assert
    expect(match.getMatchStateHistory()).toHaveLength(2)
    expect(match.getMatchStateHistory()).toContainEqual(initialMatchState)
    expect(match.getMatchStateHistory()).toContainEqual(injectedMatchState)
    expect(match.getMatchState()).toBe(injectedMatchState)
    expect(match.getCurrentTurnNumber()).toBe(2)
    expect(match.getCurrentTurn()).toBe(player2)
    expect(mockUpdateA).toHaveBeenCalledTimes(1)
    expect(mockUpdateA).toHaveBeenCalledWith(injectedMatchState.serialize())
  })

  describe('move', () => {
    it('should stop the match if the output value of a move is not a positive integer', () => {
      expect.hasAssertions()
      // arrange
      const matchMove = new Match(human, ai, () => 0)
      const [player1, player2] = match.getPlayers()

      const initState = {
        nextTurn: player1,
        outputNumber: 0,
        status: MatchStatus.Start,
        turnNumber: 0,
      }

      const expectedMoveState = {
        action: -1,
        currentTurn: player1,
        inputNumber: 0,
        outputNumber: (0 - 1) / 3,
        status: MatchStatus.Stop,
        turnNumber: 1,
        winningPlayer: player2,
      }

      matchMove.init()

      // act
      matchMove.move(-1) // output = (0 -1)/3

      // assert
      expect(matchMove.getMatchStatus()).toBe(MatchStatus.Stop)
      expect(matchMove.getMatchStateHistory()).toMatchObject([
        initState,
        expectedMoveState,
      ])
    })

    it('should stop the match if output value of a move not divisible by three', () => {
      expect.hasAssertions()
      // arrange
      const matchMove = new Match(human, ai, () => 18)
      const [player1, player2] = match.getPlayers()
      matchMove.init()

      // act
      matchMove.move(1)

      // assert
      expect(matchMove.getMatchStatus()).toBe(MatchStatus.Stop)
      expect(matchMove.getMatchStateHistory()).toMatchObject([
        {
          nextTurn: player1,
          outputNumber: 18,
          status: MatchStatus.Start,
          turnNumber: 0,
        },
        {
          action: 1,
          currentTurn: player1,
          inputNumber: 18,
          outputNumber: (18 + 1) / 3,
          status: MatchStatus.Stop,
          turnNumber: 1,
          winningPlayer: player2,
        },
      ])
    })

    it('should stop the match if output value of a move  is equal to one', () => {
      expect.hasAssertions()
      // arrange
      const matchMove = new Match(human, ai, () => 3)
      const [player1, player2] = match.getPlayers()
      matchMove.init()

      // act
      matchMove.move(0)

      // assert
      expect(matchMove.getMatchStatus()).toBe(MatchStatus.Stop)
      expect(matchMove.getMatchStateHistory()).toMatchObject([
        {
          nextTurn: player1,
          outputNumber: 3,
          status: MatchStatus.Start,
          turnNumber: 0,
        },
        {
          action: 0,
          currentTurn: player1,
          inputNumber: 3,
          outputNumber: (3 + 0) / 3,
          status: MatchStatus.Stop,
          turnNumber: 1,
          winningPlayer: player1,
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
      expect(match.getMatchState().outputNumber).toBe(initialValue) // 100
      expect(match.getCurrentTurn()).toBe(player1)

      /* TURN 1: PLAYER 1  MOVING */

      // act
      match.move(-1)

      // assert:
      expect(match.getMatchStateHistory()).toHaveLength(2)
      expect(match.getMatchStateHistory()).toMatchObject([
        {
          nextTurn: player1,
          outputNumber: initialValue,
          status: MatchStatus.Start,
          turnNumber: 0,
        },
        {
          action: -1,
          currentTurn: player1,
          inputNumber: initialValue,
          nextTurn: player2,
          outputNumber: (initialValue - 1) / 3,
          status: MatchStatus.Playing,
          turnNumber: 1,
        },
      ])

      /* TURN 2: PLAYER 2 MOVING */

      // act
      match.move(0)

      // assert
      expect(match.getMatchStateHistory()).toHaveLength(3)
      expect(match.getMatchStateHistory()).toMatchObject([
        {
          nextTurn: player1,
          outputNumber: initialValue,
          status: MatchStatus.Start,
          turnNumber: 0,
        },
        {
          action: -1,
          currentTurn: player1,
          inputNumber: initialValue,
          nextTurn: player2,
          outputNumber: (initialValue - 1) / 3,
          status: MatchStatus.Playing,
          turnNumber: 1,
        },
        {
          action: 0,
          currentTurn: player2,
          inputNumber: 33,
          outputNumber: (33 + 0) / 3,
          status: MatchStatus.Stop,
          turnNumber: 2,
          winningPlayer: player1,
        },
      ])

      expect(() => match.move(0)).toThrow(
        "Match ended. Can't make a move after a match has ended"
      )
    })
  })

  describe('observer pattern', () => {
    it('should implement the ISubject interface', () => {
      expect.hasAssertions()
      expect(match).toHaveProperty('registerObserver')
      expect(match).toHaveProperty('removeObserver')
      expect(match).toHaveProperty('notifyObservers')
    })

    it('should allow to register many observers', () => {
      expect.hasAssertions()
      expect(match['observers']).toHaveLength(0)
      // act
      expect(() => match.registerObserver(observerA)).not.toThrow()
      expect(() => match.registerObserver(observerB)).not.toThrow()
      // assert
      expect(match['observers']).toHaveLength(2)
      expect(match['observers']).toContain(observerA)
      expect(match['observers']).toContain(observerB)
      expect(mockUpdateA).toHaveBeenCalledTimes(0)
      expect(mockUpdateB).toHaveBeenCalledTimes(0)
    })

    it('should allow to remove an observer', () => {
      expect.hasAssertions()
      // arrange
      expect(match['observers']).toHaveLength(0)
      match.registerObserver(observerA)
      match.registerObserver(observerB)
      expect(match['observers']).toHaveLength(2)
      // act
      expect(() => match.removeObserver(observerA)).not.toThrow()
      // assert
      expect(match['observers']).toHaveLength(1)
      expect(match['observers']).toContain(observerB)
      expect(match['observers']).not.toContain(observerA)
      expect(mockUpdateA).toHaveBeenCalledTimes(0)
      expect(mockUpdateB).toHaveBeenCalledTimes(0)
    })

    it('should notify all observer', () => {
      expect.hasAssertions()
      // arrange
      match.registerObserver(observerA)
      match.registerObserver(observerB)
      match.init()
      // act
      expect(() => match.notifyObservers()).not.toThrow()
      // assert
      const expectedUpdateArgument = {
        action: undefined,
        currentTurn: undefined,
        inputNumber: undefined,
        nextTurn: human.getId(),
        outputNumber: 100,
        status: MatchStatus.Start,
        turnNumber: 0,
        winningPlayer: undefined,
      }
      expect(mockUpdateA).toHaveBeenCalledTimes(1)
      expect(mockUpdateA).toHaveBeenCalledWith(expectedUpdateArgument)
      expect(mockUpdateB).toHaveBeenCalledTimes(1)
      expect(mockUpdateB).toHaveBeenCalledWith(expectedUpdateArgument)
    })
  })
})
