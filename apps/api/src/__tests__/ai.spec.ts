import { describe, expect, it, jest } from '@jest/globals'

import { IPlayer, PlayerType } from '../interfaces'
import { AI, UUIDService } from '../model'

import type { IPlayerEntity } from '@game-of-three/contracts'

describe('ai class', () => {
  const AI_ID = 'AI_ID'
  const AI_NAME = 'AI_NAME'
  const ai: IPlayer = new AI(AI_ID, AI_NAME)

  it('should allow for uuid Service to be injected', () => {
    expect.hasAssertions()

    const uuidService: UUIDService<typeof AI_ID> = () => AI_ID
    const uuidServiceMock = jest.fn(uuidService)
    const al = AI.make(uuidServiceMock)
    expect.hasAssertions()
    expect(uuidServiceMock).toHaveBeenCalledTimes(1)
    expect(uuidServiceMock).toHaveReturnedWith('AI_ID')
    expect(al.id).toBe('AI_ID')
    expect(al.name).toBe('AI')
  })

  it('should return the `id` when `getId` method is invoked', () => {
    expect.hasAssertions()
    expect(ai.id).toBe('AI_ID')
  })

  it('should return the `name` when `getName` method is invoked', () => {
    expect.hasAssertions()
    expect(ai.name).toBe('AI_NAME')
  })

  it('should return the `AI` when `getType` method is invoked', () => {
    expect.hasAssertions()
    expect(ai.type).toBe(PlayerType.AI)
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

  it('should allow to be serialized', () => {
    expect.hasAssertions()

    let serializedAIPlayerObject!: IPlayerEntity
    expect(() => (serializedAIPlayerObject = ai.serialize())).not.toThrow()

    expect(serializedAIPlayerObject).toHaveProperty('id')
    expect(serializedAIPlayerObject).toHaveProperty('type')
    expect(serializedAIPlayerObject).toHaveProperty('name')
    expect(serializedAIPlayerObject).toMatchObject({
      id: ai.id,
      name: ai.name,
      type: ai.type,
    })
  })
})
