import { v4 as uuid } from 'uuid'

import type { IAI, IPlayer } from '../interfaces'
import { PlayerType } from '../interfaces/player.interface'

export type UUIDService = () => string

export class AI implements IPlayer {
  private static readonly NAME = 'AI'
  private readonly id: string
  private readonly name: string
  private readonly type: IAI

  public constructor(id: string, name: string) {
    this.id = id
    this.name = name
    this.type = PlayerType.AI
  }

  static make(uuidService: UUIDService = uuid): AI {
    return new AI(uuidService(), AI.NAME)
  }

  public getId(): string {
    return this.id
  }

  public getName(): string {
    return this.name
  }

  public getType(): IAI {
    return this.type
  }

  public isAi(): true {
    return true
  }

  public isSame(player: IPlayer): player is this {
    return this.id === player.getId()
  }
}
