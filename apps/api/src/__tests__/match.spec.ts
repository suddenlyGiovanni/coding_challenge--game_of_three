import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals'

import type { IMatchState, IObserver } from '../interfaces'

import {
  AI,
  Human,
  INumberGeneratorStrategy,
  IUUIDStrategy,
  Match,
  MatchState,
} from '../model'

import {
  IMatchStateSerialized,
  IMatchStateStartSerialized,
  MatchStatus,
} from '@game-of-three/api-interfaces'

describe('match', () => {
  const PLAYER_1_ID = 'ID_HUMAN'
  const PLAYER_1_NAME = 'NAME_HUMAN'
  const PLAYER_2_ID = 'ID_AI'
  const ANSWER_TO_THE_ULTIMATE_QUESTION_OF_LIFE_THE_UNIVERSE_AND_EVERYTHING = `42`

  const human = new Human(PLAYER_1_ID, PLAYER_1_NAME)
  const ai = AI.make(() => PLAYER_2_ID)

  let match: Match<typeof human, typeof ai>

  const numberGeneratorStrategy: INumberGeneratorStrategy = () => 100
  const uuidStrategy: IUUIDStrategy = () =>
    ANSWER_TO_THE_ULTIMATE_QUESTION_OF_LIFE_THE_UNIVERSE_AND_EVERYTHING

  const mockNumberGeneratorStrategy = jest.fn(numberGeneratorStrategy)
  const mockUUIDStrategy = jest.fn(uuidStrategy)
  const mockUpdateA = jest.fn()
  const mockUpdateB = jest.fn()

  const observerA: IObserver<IMatchStateSerialized> = { update: mockUpdateA }
  const observerB: IObserver<IMatchStateSerialized> = { update: mockUpdateB }

  beforeEach(() => {
    match = new Match(human, ai, mockNumberGeneratorStrategy, mockUUIDStrategy)
  })

  afterEach(() => {
    mockNumberGeneratorStrategy.mockClear()
    mockUUIDStrategy.mockClear()
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
    expect(() => match.getId()).not.toThrow()
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

  it('uuidStrategy should work correctly', () => {
    expect.hasAssertions()
    expect(mockUUIDStrategy).toHaveBeenCalledTimes(1)
    expect(match.getId()).toBe(
      ANSWER_TO_THE_ULTIMATE_QUESTION_OF_LIFE_THE_UNIVERSE_AND_EVERYTHING
    )
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
  })

  it('should get the current turn number', () => {
    expect.hasAssertions()
    match.init()
    expect(match.getCurrentTurnNumber()).toBe(1)
  })

  it('should gets who will be playing the next turn (without setting it)', () => {
    expect.hasAssertions()
    match.init()
    expect(match.peekNextTurn()).toBe(ai)
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
      const expectedUpdateArgument: IMatchStateStartSerialized = {
        nextTurn: human.getId(),
        outputNumber: 100,
        status: MatchStatus.Start,
        turnNumber: 0,
      }
      expect(mockUpdateA).toHaveBeenCalledTimes(2) // called once when init
      expect(mockUpdateA).toHaveBeenCalledWith(expectedUpdateArgument)
      expect(mockUpdateB).toHaveBeenCalledTimes(2)
      expect(mockUpdateB).toHaveBeenCalledWith(expectedUpdateArgument)
    })
  })
})
