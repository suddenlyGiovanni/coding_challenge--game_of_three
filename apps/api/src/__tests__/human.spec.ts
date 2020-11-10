import { expect, it, describe } from '@jest/globals'
import { PlayerType } from '../interfaces/player.interface'
import { Human } from '../model/human'

import type { IPlayer } from '../interfaces'

describe('Human class', () => {
  const ID_1 = 'PLAYER_1_ID'
  const NAME_1 = 'PLAYER_1_NAME'
  const ID_2 = 'PLAYER_2_ID'
  const NAME_2 = 'PLAYER_2_NAME'
  const player1: IPlayer = new Human(ID_1, NAME_1)
  const player2: IPlayer = new Human(ID_2, NAME_2)

  it('should return the `id` when `getId` method is invoked', () => {
    expect.hasAssertions()
    expect(player1.getId()).toBe('PLAYER_1_ID')
  })

  it('should return the `name` when `getName` method is invoked', () => {
    expect.hasAssertions()
    expect(player1.getName()).toBe('PLAYER_1_NAME')
  })

  it('should return the `HUMAN` when `getType` method is invoked ', () => {
    expect.hasAssertions()
    expect(player1.getType()).toBe(PlayerType.HUMAN)
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
})
