import type { IHUMAN, IPlayer } from '../interfaces'
import { PlayerType } from '../interfaces/player.interface'

import type { AI } from './ai'

export class Human<PlayerID extends string = string>
  implements IPlayer<PlayerID> {
  private readonly id: PlayerID

  private name: string

  private readonly type: IHUMAN

  public constructor(id: PlayerID, name?: string) {
    this.id = id
    this.name = name || ''
    this.type = PlayerType.HUMAN
  }

  public getId(): PlayerID {
    return this.id
  }

  public getName(): string {
    return this.name
  }

  public getType(): IHUMAN {
    return this.type
  }

  public isAi(): this is AI<PlayerID> {
    return false
  }

  public isSame(player: IPlayer<PlayerID>): player is this {
    return this.id === player.getId()
  }

  public setName(name: string): void {
    this.name = name
  }
}
