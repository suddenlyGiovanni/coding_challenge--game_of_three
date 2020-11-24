import { describe, expect, it } from '@jest/globals'

import { IPlayer, PlayerType } from '../interfaces'
import { Human } from '../model'

import type { PlayerSerialized } from '@game-of-three/contracts'

describe('human class', () => {
  const ID_1 = 'PLAYER_1_ID'
  const NAME_1 = 'PLAYER_1_NAME'
  const ID_2 = 'PLAYER_2_ID'
  const ID_3 = 'PLAYER_3_ID'
  const NAME_2 = 'PLAYER_2_NAME'
  const player1: IPlayer = new Human(ID_1, NAME_1)
  const player2: IPlayer = new Human(ID_2, NAME_2)
  const player3 = new Human(ID_3)

  it('should return the `id` when `getId` method is invoked', () => {
    expect.hasAssertions()
    expect(player1.id).toBe('PLAYER_1_ID')
  })

  it('should return the `name` when `getName` method is invoked', () => {
    expect.hasAssertions()
    expect(player1.name).toBe('PLAYER_1_NAME')
    expect(player3.name).toBe('')
  })

  it('should allow to set the `name`', () => {
    expect.hasAssertions()
    expect(player3.name).toBe('')
    expect(() => player3.setName('PLAYER_3_NAME')).not.toThrow()
    expect(player3.name).toBe('PLAYER_3_NAME')
  })

  it('should return the `HUMAN` when `getType` method is invoked', () => {
    expect.hasAssertions()
    expect(player1.type).toBe(PlayerType.HUMAN)
  })

  it('should return the `false` when `isAi` method is invoked', () => {
    expect.hasAssertions()
    expect(player1.isAi()).toBe(false)
  })

  it('should return the a true when `isSame` method is invoked with the same IPlayer', () => {
    expect.hasAssertions()
    expect(player1.isSame(player1)).toBe(true)
  })

  it('should return the a false when `isSame` method is invoked with the another IPlayer', () => {
    expect.hasAssertions()
    expect(player1.isSame(player2)).toBe(false)
  })

  it('should allow to be serialized', () => {
    expect.hasAssertions()

    let serializedPlayerObject: PlayerSerialized
    expect(() => (serializedPlayerObject = player1.serialize())).not.toThrow()

    expect(serializedPlayerObject).toHaveProperty('id')
    expect(serializedPlayerObject).toHaveProperty('type')
    expect(serializedPlayerObject).toHaveProperty('name')
    expect(serializedPlayerObject).toMatchObject({
      id: player1.id,
      name: player1.name,
      type: player1.type,
    })
  })
})
