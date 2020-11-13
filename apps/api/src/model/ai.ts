import { v4 as uuid } from 'uuid'

import type { IAI, IPlayer } from '../interfaces'
import { PlayerType } from '../interfaces/player.interface'

export type UUIDService = () => string

export class AI<PlayerID extends string> implements IPlayer<PlayerID> {
  private static readonly NAME = 'AI'

  private readonly id: PlayerID

  private readonly name: string

  private readonly type: IAI

  public constructor(id: PlayerID, name: string) {
    this.id = id
    this.name = name
    this.type = PlayerType.AI
  }

  static make(uuidService: UUIDService = uuid): AI<ReturnType<UUIDService>> {
    return new AI(uuidService(), AI.NAME)
  }

  public getId(): PlayerID {
    return this.id
  }

  public getName(): string {
    return this.name
  }

  public getType(): IAI {
    return this.type
  }

  public isAi(): this is AI<PlayerID> {
    return true
  }

  public isSame(player: IPlayer<PlayerID>): player is this {
    return this.id === player.getId()
  }
}
