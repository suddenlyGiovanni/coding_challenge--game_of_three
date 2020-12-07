import type { IHUMAN, IPlayer } from '../interfaces'
import { PlayerType } from '../interfaces/player.interface'

import type { AI } from './ai'

import { IPlayerEntity } from '@game-of-three/contracts'

export class Human<PlayerID extends string = string>
  implements IPlayer<PlayerID> {
  public readonly __type: 'Player' = 'Player'

  private readonly _id: PlayerID

  private _name: string

  private readonly _type: IHUMAN

  public constructor(id: PlayerID, name?: string) {
    this._id = id
    this._name = name || ''
    this._type = PlayerType.HUMAN
  }

  public get id(): PlayerID {
    return this._id
  }

  public get name(): string {
    return this._name
  }

  public get type(): IHUMAN {
    return this._type
  }

  public isAi(): this is AI<PlayerID> {
    return false
  }

  public isSame(player: IPlayer<PlayerID>): player is this {
    return this._id === player.id
  }

  public serialize(): IPlayerEntity<PlayerID> {
    return {
      __type: 'Player',
      id: this.id,
      name: this.name,
      type: this.type,
    }
  }

  public setName(name: string): void {
    this._name = name
  }
}
