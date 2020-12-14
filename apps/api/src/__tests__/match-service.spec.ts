import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals'

import type { IObserver } from '../interfaces'

import { MatchService } from '../match-service'
import { AI, Human, INumberGeneratorStrategy } from '../model'

import { flushPromises } from './helpers'

import {
  IMatchEntity,
  IMatchEntityPlaying,
  IMatchEntityStart,
  IMatchEntityStop,
  MatchStatus,
} from '@game-of-three/contracts'

describe('match-service', () => {
  const PLAYER_1_ID = 'PLAYER_1_ID'
  const PLAYER_2_ID = 'PLAYER_2_ID'
  const PLAYER_AI_ID = 'PLAYER_AI_ID'
  const PLAYER_1_NAME = 'PLAYER_1_NAME'
  const PLAYER_2_NAME = 'PLAYER_2_NAME'

  const player1 = new Human(PLAYER_1_ID, PLAYER_1_NAME)
  const player2 = new Human(PLAYER_2_ID, PLAYER_2_NAME)
  const playerAI = AI.make(() => PLAYER_AI_ID)

  const numberGeneratorStrategy: INumberGeneratorStrategy = () => 100

  const mockNumberGeneratorStrategy = jest.fn(numberGeneratorStrategy)
  const onMatchStateUpdateMock = jest.fn()
  const debugObserver: IObserver<IMatchEntity> = {
    update: onMatchStateUpdateMock,
  }

  afterEach(() => {
    mockNumberGeneratorStrategy.mockClear()
    onMatchStateUpdateMock.mockClear()
  })

  it('should exist', () => {
    expect.hasAssertions()
    expect(MatchService).toBeDefined()
  })

  describe('two human players', () => {
    let twoPlayersMatchService: MatchService<
      typeof PLAYER_1_ID,
      typeof PLAYER_2_ID
    >

    beforeEach(() => {
      twoPlayersMatchService = new MatchService({
        debugObserver: debugObserver,
        numberGeneratorStrategy: mockNumberGeneratorStrategy,
        players: [player1, player2],
      })
    })

    it('should instantiate correctly', () => {
      expect.hasAssertions()
      expect(twoPlayersMatchService).toBeInstanceOf(MatchService)
      expect(twoPlayersMatchService).not.toBe(
        new MatchService({ players: [player1, playerAI] })
      )
    })

    it('should not allow to move if it is not the player turn', () => {
      expect.hasAssertions()
      const initialState: IMatchEntityStart = {
        __type: 'MatchState',
        id: twoPlayersMatchService.id,
        nextTurn: player1.serialize(),
        outputNumber: 100,
        players: [player1.serialize(), player2.serialize()],
        status: MatchStatus.Start,
        turnNumber: 0,
      }
      // TURN 0 -> RANDOM INITIAL VALUE
      expect(onMatchStateUpdateMock).toHaveBeenCalledWith(initialState)

      // WRONG TURN
      expect(() => twoPlayersMatchService.move(player2, -1)).toThrow(
        'Not player turn.'
      )
    })

    it('should allow to move until one player reaches one', () => {
      expect.hasAssertions()
      const initialState: IMatchEntityStart = {
        __type: 'MatchState',
        id: twoPlayersMatchService.id,
        nextTurn: player1.serialize(),
        outputNumber: 100,
        players: [player1.serialize(), player2.serialize()],
        status: MatchStatus.Start,
        turnNumber: 0,
      }
      // TURN 0 -> RANDOM INITIAL VALUE
      expect(onMatchStateUpdateMock).toHaveBeenCalledWith(initialState)

      // TURN 1 ->  PLAYER 1 MOVE:
      // act
      expect(() => twoPlayersMatchService.move(player1, -1)).not.toThrow()
      // assert
      const expectedState1: IMatchEntityPlaying = {
        __type: 'MatchState',
        action: -1,
        currentTurn: player1.serialize(),
        id: twoPlayersMatchService.id,
        inputNumber: 100,
        nextTurn: player2.serialize(),
        outputNumber: 33,
        players: [player1.serialize(), player2.serialize()],
        status: MatchStatus.Playing,
        turnNumber: 1,
      }
      expect(onMatchStateUpdateMock).toHaveBeenCalledTimes(2)
      expect(onMatchStateUpdateMock).toHaveBeenLastCalledWith(expectedState1)

      // TURN 2 -> PLAYER 2 MOVE:
      // act
      expect(() => twoPlayersMatchService.move(player2, 0)).not.toThrow()
      // assert
      const expectedState2: IMatchEntityPlaying = {
        __type: 'MatchState',
        action: 0,
        currentTurn: player2.serialize(),
        id: twoPlayersMatchService.id,
        inputNumber: 33,
        nextTurn: player1.serialize(),
        outputNumber: 11,
        players: [player1.serialize(), player2.serialize()],
        status: MatchStatus.Playing,
        turnNumber: 2,
      }
      expect(onMatchStateUpdateMock).toHaveBeenCalledTimes(3)
      expect(onMatchStateUpdateMock).toHaveBeenNthCalledWith(3, expectedState2)

      // TURN 3 -> PLAYER 1 MOVE:
      // act
      expect(() => twoPlayersMatchService.move(player1, 1)).not.toThrow()
      // assert
      const expectedState3: IMatchEntityPlaying = {
        __type: 'MatchState',
        action: 1,
        currentTurn: player1.serialize(),
        id: twoPlayersMatchService.id,
        inputNumber: 11,
        nextTurn: player2.serialize(),
        outputNumber: 4,
        players: [player1.serialize(), player2.serialize()],
        status: MatchStatus.Playing,
        turnNumber: 3,
      }
      expect(onMatchStateUpdateMock).toHaveBeenCalledTimes(4)
      expect(onMatchStateUpdateMock).toHaveBeenNthCalledWith(4, expectedState3)

      // TURN 4 -> PLAYER 2 MOVE:

      expect(() => twoPlayersMatchService.move(player2, -1)).not.toThrow()
      // assert
      const expectedState4: IMatchEntityStop = {
        __type: 'MatchState',
        action: -1,
        currentTurn: player2.serialize(),
        id: twoPlayersMatchService.id,
        inputNumber: 4,
        outputNumber: 1,
        players: [player1.serialize(), player2.serialize()],
        status: MatchStatus.Stop,
        turnNumber: 4,
        winningPlayer: player2.serialize(),
      }
      expect(onMatchStateUpdateMock).toHaveBeenCalledTimes(5)
      expect(onMatchStateUpdateMock).toHaveBeenNthCalledWith(5, expectedState4)

      // NO MORE TURN TURN CAN BE PLAYED
      expect(() => twoPlayersMatchService.move(player1, -1)).toThrow(
        "Match ended. Can't make a move after a match has ended"
      )
    })

    it('should allow to move until a player commits an error', () => {
      expect.hasAssertions()
      const initialState: IMatchEntityStart = {
        __type: 'MatchState',
        id: twoPlayersMatchService.id,
        nextTurn: player1.serialize(),
        outputNumber: 100,
        players: [player1.serialize(), player2.serialize()],
        status: MatchStatus.Start,
        turnNumber: 0,
      }

      // TURN 0 -> RANDOM INITIAL VALUE
      expect(onMatchStateUpdateMock).toHaveBeenCalledWith(initialState)

      // TURN 1 ->  PLAYER 1 MOVE:
      // act
      expect(() => twoPlayersMatchService.move(player1, -1)).not.toThrow()
      // assert
      const expectedState1: IMatchEntityPlaying = {
        __type: 'MatchState',
        action: -1,
        currentTurn: player1.serialize(),
        id: twoPlayersMatchService.id,
        inputNumber: 100,
        nextTurn: player2.serialize(),
        outputNumber: 33,
        players: [player1.serialize(), player2.serialize()],
        status: MatchStatus.Playing,
        turnNumber: 1,
      }
      expect(onMatchStateUpdateMock).toHaveBeenCalledTimes(2)
      expect(onMatchStateUpdateMock).toHaveBeenLastCalledWith(expectedState1)

      // TURN 2 -> PLAYER 2 MOVE:
      // act
      expect(() => twoPlayersMatchService.move(player2, 1)).not.toThrow()
      // assert
      const expectedState2: IMatchEntityStop = {
        __type: 'MatchState',
        action: 1,
        currentTurn: player2.serialize(),
        id: twoPlayersMatchService.id,
        inputNumber: 33,
        outputNumber: 34 / 3,
        players: [player1.serialize(), player2.serialize()],
        status: MatchStatus.Stop,
        turnNumber: 2,
        winningPlayer: player1.serialize(),
      }
      expect(onMatchStateUpdateMock).toHaveBeenCalledTimes(3)
      expect(onMatchStateUpdateMock).toHaveBeenLastCalledWith(expectedState2)
    })
  })

  describe('a single player against an AI', () => {
    let onePlayerAgainstAIMatchService: MatchService<typeof PLAYER_1_ID, string>

    beforeEach(() => {
      onePlayerAgainstAIMatchService = new MatchService({
        debugObserver: debugObserver,
        numberGeneratorStrategy: mockNumberGeneratorStrategy,
        players: [player1, playerAI],
      })
    })

    afterEach(() => {
      jest.useRealTimers()
    })

    it('should instantiate correctly', () => {
      expect.hasAssertions()
      expect(onePlayerAgainstAIMatchService).toBeInstanceOf(MatchService)
      expect(onePlayerAgainstAIMatchService).not.toBe(
        new MatchService({ players: [player1, playerAI] })
      )
      expect(onePlayerAgainstAIMatchService['_aiActor']['observers']).toContain(
        onePlayerAgainstAIMatchService['_aiActorMoveObserver']
      )
      expect(onePlayerAgainstAIMatchService['_match']['_observers']).toContain(
        onePlayerAgainstAIMatchService['_aiActor']
      )
    })

    it('should see the ai counteract the human player moves', async () => {
      expect.hasAssertions()
      jest.useFakeTimers()
      const initialState: IMatchEntityStart = {
        __type: 'MatchState',
        id: onePlayerAgainstAIMatchService.id,
        nextTurn: player1.serialize(),
        outputNumber: 100,
        players: [player1.serialize(), playerAI.serialize()],
        status: MatchStatus.Start,
        turnNumber: 0,
      }

      // TURN 0 -> RANDOM INITIAL VALUE
      expect(onMatchStateUpdateMock).toHaveBeenCalledWith(initialState)

      // TURN 1 ->  PLAYER 1 MOVE:
      // act
      expect(() =>
        onePlayerAgainstAIMatchService.move(player1, -1)
      ).not.toThrow()
      // assert
      const expectedState1: IMatchEntityPlaying = {
        __type: 'MatchState',
        action: -1,
        currentTurn: player1.serialize(),
        id: onePlayerAgainstAIMatchService.id,
        inputNumber: 100,
        nextTurn: playerAI.serialize(),
        outputNumber: 33,
        players: [player1.serialize(), playerAI.serialize()],
        status: MatchStatus.Playing,
        turnNumber: 1,
      }
      expect(onMatchStateUpdateMock).toHaveBeenCalledTimes(2)
      expect(onMatchStateUpdateMock).toHaveBeenLastCalledWith(expectedState1)

      // TURN 2 -> AI MOVE:
      // wait for the aiActor to make a move
      jest.advanceTimersByTime(5000)
      await flushPromises()
      // assert
      const expectedState2: IMatchEntityPlaying = {
        __type: 'MatchState',
        action: 0,
        currentTurn: playerAI.serialize(),
        id: onePlayerAgainstAIMatchService.id,
        inputNumber: 33,
        nextTurn: player1.serialize(),
        outputNumber: 11,
        players: [player1.serialize(), playerAI.serialize()],
        status: MatchStatus.Playing,
        turnNumber: 2,
      }
      expect(onMatchStateUpdateMock).toHaveBeenCalledTimes(3)
      expect(onMatchStateUpdateMock).toHaveBeenLastCalledWith(expectedState2)

      // TURN 3 ->  PLAYER 1 MOVE:
      // act
      expect(() =>
        onePlayerAgainstAIMatchService.move(player1, 1)
      ).not.toThrow()
      // assert
      const expectedState3: IMatchEntityPlaying = {
        __type: 'MatchState',
        action: 1,
        currentTurn: player1.serialize(),
        id: onePlayerAgainstAIMatchService.id,
        inputNumber: 11,
        nextTurn: playerAI.serialize(),
        outputNumber: 4,
        players: [player1.serialize(), playerAI.serialize()],
        status: MatchStatus.Playing,
        turnNumber: 3,
      }
      expect(onMatchStateUpdateMock).toHaveBeenCalledTimes(4)
      expect(onMatchStateUpdateMock).toHaveBeenLastCalledWith(expectedState3)

      // TURN 4 -> AI MOVE:
      // wait for the aiActor to make a move
      jest.advanceTimersByTime(5000)
      await flushPromises()
      // assert
      const expectedState4: IMatchEntityStop = {
        __type: 'MatchState',
        action: -1,
        currentTurn: playerAI.serialize(),
        id: onePlayerAgainstAIMatchService.id,
        inputNumber: 4,
        outputNumber: 1,
        players: [player1.serialize(), playerAI.serialize()],
        status: MatchStatus.Stop,
        turnNumber: 4,
        winningPlayer: playerAI.serialize(),
      }
      expect(onMatchStateUpdateMock).toHaveBeenCalledTimes(5)
      expect(onMatchStateUpdateMock).toHaveBeenLastCalledWith(expectedState4)
    })
  })
})
