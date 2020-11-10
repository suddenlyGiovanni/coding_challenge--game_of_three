import { PlayerType } from '../interfaces/player.interface'

import type { IPlayer, IHUMAN } from '../interfaces'

export class Human implements IPlayer {
  private readonly id: string
  private readonly name: string
  private readonly type: IHUMAN

  public constructor(id: string, name: string) {
    this.id = id
    this.name = name
    this.type = PlayerType.HUMAN
  }

  public isSame(player: IPlayer): player is this {
    return this.id === player.getId()
  }

  public getType(): IHUMAN {
    return this.type
  }

  public getId(): string {
    return this.id
  }

  public getName(): string {
    return this.name
  }

  public isAi(): false {
    return false
  }
}