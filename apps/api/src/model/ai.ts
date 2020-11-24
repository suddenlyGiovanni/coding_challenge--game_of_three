import { v4 as uuid } from 'uuid'

import type { IAI, IPlayer } from '../interfaces'
import { PlayerType } from '../interfaces/player.interface'

import { PlayerSerialized } from '@game-of-three/contracts'

export type UUIDService = () => string

export class AI<PlayerID extends string> implements IPlayer<PlayerID> {
  private static readonly NAME = 'AI'

  private readonly _id: PlayerID

  private readonly _name: string

  private readonly _type: IAI

  public constructor(id: PlayerID, name: string) {
    this._id = id
    this._name = name
    this._type = PlayerType.AI
  }

  static make(uuidService: UUIDService = uuid): AI<ReturnType<UUIDService>> {
    return new AI(uuidService(), AI.NAME)
  }

  public get id(): PlayerID {
    return this._id
  }

  public get name(): string {
    return this._name
  }

  public get type(): IAI {
    return this._type
  }

  public isAi(): this is AI<PlayerID> {
    return true
  }

  public isSame(player: IPlayer<PlayerID>): player is this {
    return this._id === player.id
  }

  public serialize(): PlayerSerialized {
    return {
      id: this.id,
      name: this.name,
      type: this.type,
    }
  }
}
