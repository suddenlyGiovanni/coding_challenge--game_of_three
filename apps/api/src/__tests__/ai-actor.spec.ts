import {
  afterAll,
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals'

import { AIActor } from '../ai-actor'
import type { IObserver } from '../interfaces'
import { AI } from '../model'

import { flushPromises } from './helpers'

import {
  IAction,
  IMatchStateSerialized,
  MatchStatus,
} from '@game-of-three/contracts'

describe('ai actor', () => {
  const player1ID = 'HUMAN_PLAYER_ID'
  const ai = AI.make(() => 'ID_AI')
  let aiActor: AIActor<string>
  const mockUpdateA = jest.fn()
  const mockUpdateB = jest.fn()
  const observerA: IObserver<IAction> = { update: mockUpdateA }
  const observerB: IObserver<IAction> = { update: mockUpdateB }

  const matchStateSerialized: IMatchStateSerialized = {
    action: 0,
    currentTurn: player1ID,
    inputNumber: 12,
    nextTurn: ai.id,
    outputNumber: 12,
    status: MatchStatus.Playing,
    turnNumber: 2,
  }

  beforeEach(() => {
    mockUpdateA.mockClear()
    mockUpdateB.mockClear()
    aiActor = new AIActor(ai)
  })

  afterEach(() => {
    aiActor.removeObserver(observerA)
    aiActor.removeObserver(observerB)
    jest.clearAllMocks()
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  it('should exist', () => {
    expect.hasAssertions()
    expect(AIActor).toBeDefined()
  })

  it('should instantiate correctly', () => {
    expect.hasAssertions()
    expect(() => new AIActor(ai)).not.toThrow()
  })

  it('should implement the `ISubject` interface', () => {
    expect.hasAssertions()
    const action: IAction = 0
    expect(aiActor).toHaveProperty('registerObserver')

    expect(aiActor).toHaveProperty('_notifyObservers')

    expect(mockUpdateA).toHaveBeenCalledTimes(0)
    expect(mockUpdateB).toHaveBeenCalledTimes(0)

    expect(() => aiActor.registerObserver(observerA)).not.toThrow()
    expect(() => aiActor.registerObserver(observerB)).not.toThrow()

    // act
    expect(() => aiActor['_notifyObservers'](action)).not.toThrow()
    expect(mockUpdateA).toHaveBeenCalledTimes(1)
    expect(mockUpdateA).toHaveBeenLastCalledWith(action)
    expect(mockUpdateB).toHaveBeenCalledTimes(1)
    expect(mockUpdateB).toHaveBeenLastCalledWith(action)

    expect(aiActor).toHaveProperty('removeObserver')
    expect(() => aiActor.removeObserver(observerA)).not.toThrow()
    expect(() => aiActor.removeObserver(observerB)).not.toThrow()

    expect(mockUpdateA).toHaveBeenCalledTimes(1)
    expect(mockUpdateB).toHaveBeenCalledTimes(1)

    expect(() => aiActor['_notifyObservers'](action)).not.toThrow()
    expect(mockUpdateA).toHaveBeenCalledTimes(1)
    expect(mockUpdateB).toHaveBeenCalledTimes(1)
  })

  it('should implement the `IObserver` interface', () => {
    expect.hasAssertions()
    expect(aiActor).toHaveProperty('update')
    expect(() => aiActor.update(matchStateSerialized)).not.toThrow()
  })

  describe('should act when its update method gets called by the ISubject', () => {
    it('should only act when it is his turn and the match has not ended', () => {
      expect.hasAssertions()
      // arrange
      aiActor.registerObserver(observerA)

      // act
      expect(() =>
        aiActor.update({
          action: -1,
          currentTurn: player1ID,
          inputNumber: 100,
          nextTurn: ai.id,
          outputNumber: 33,
          status: MatchStatus.Playing,
          turnNumber: 1,
        })
      ).not.toThrow()

      // assert
      expect(mockUpdateA).not.toHaveBeenCalled()

      expect(() =>
        aiActor.update({
          action: -1,
          currentTurn: player1ID,
          inputNumber: 4,
          outputNumber: 1,
          status: MatchStatus.Stop,
          turnNumber: 4,
          winningPlayer: player1ID,
        })
      ).not.toThrow()

      expect(mockUpdateA).not.toHaveBeenCalled()
    })

    it('should make the best possible choice for the next move', async () => {
      expect.hasAssertions()
      jest.useFakeTimers()
      // arrange
      aiActor.registerObserver(observerA)

      // act
      aiActor.update({
        action: 0,
        currentTurn: player1ID,
        inputNumber: 33,
        nextTurn: ai.id,
        outputNumber: 11,
        status: MatchStatus.Playing,
        turnNumber: 4,
      })
      // At this point in time, the mockUpdateA should not have been called yet
      expect(mockUpdateA).not.toHaveBeenCalled()

      // Fast-forward until all timers have been executed
      jest.advanceTimersByTime(5000)
      await flushPromises()

      // assert
      // Now our mockUpdateA should have been called!
      expect(mockUpdateA).toHaveBeenCalledTimes(1)
      expect(mockUpdateA).toHaveBeenCalledWith(1)
    })
  })
})
