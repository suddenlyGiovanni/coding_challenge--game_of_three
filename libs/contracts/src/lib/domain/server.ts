import { IPlayerEntity, PlayerID } from './player'

export interface IServerState {
  readonly lobby: readonly PlayerID[]
  readonly player: IPlayerEntity
  readonly players: readonly IPlayerEntity[]
}
