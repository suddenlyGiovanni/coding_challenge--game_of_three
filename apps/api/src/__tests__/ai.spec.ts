import { describe, expect, it, jest } from '@jest/globals'

import { IPlayer, PlayerType } from '../interfaces'
import { AI, UUIDService } from '../model'

describe('ai class', () => {
  const AI_ID = 'AI_ID'
  const AI_NAME = 'AI_NAME'
  const ai: IPlayer = new AI(AI_ID, AI_NAME)

  it('should allow for uuid Service to be injected', () => {
    expect.hasAssertions()

    const uuidService: UUIDService = () => AI_ID
    const uuidServiceMock = jest.fn(uuidService)
    const al = AI.make(uuidServiceMock)
    expect.hasAssertions()
    expect(uuidServiceMock).toHaveBeenCalledTimes(1)
    expect(uuidServiceMock).toHaveReturnedWith('AI_ID')
    expect(al.getId()).toBe('AI_ID')
    expect(al.getName()).toBe('AI')
  })

  it('should return the `id` when `getId` method is invoked', () => {
    expect.hasAssertions()
    expect(ai.getId()).toBe('AI_ID')
  })

  it('should return the `name` when `getName` method is invoked', () => {
    expect.hasAssertions()
    expect(ai.getName()).toBe('AI_NAME')
  })

  it('should return the `AI` when `getType` method is invoked', () => {
    expect.hasAssertions()
    expect(ai.getType()).toBe(PlayerType.AI)
  })

  it('should return the `true` when `isAi` method is invoked', () => {
    expect.hasAssertions()
    expect(ai.isAi()).toBe(true)
  })

  it('should return the a true when `isSame` method is invoked with the same IPlayer', () => {
    expect.hasAssertions()
    expect(ai.isSame(ai)).toBe(true)
  })

  it('should return the a false when `isSame` method is invoked with the another IPlayer', () => {
    expect.hasAssertions()
    expect(ai.isSame(new AI('ID', 'NAME'))).toBe(false)
  })
})
