import { v4 as uuid } from 'uuid'

import { IAI, IPlayer } from '../interfaces'
import { PlayerType } from './player-type'

export class AI implements IPlayer {
  private readonly id: string
  private readonly name: string
  private readonly type: IAI
  private static readonly NAME = 'AI'

  public constructor(id: string, name: string) {
    this.id = id
    this.name = name
    this.type = PlayerType.AI
  }

  public isSame(player: IPlayer): player is this {
    return this.id === player.getId()
  }

  static make(): AI {
    return new AI(uuid(), AI.NAME)
  }

  public getType(): IAI {
    return this.type
  }

  public getId(): string {
    return this.id
  }

  public getName(): string {
    return this.name
  }

  public isAi(): true {
    return true
  }
}
