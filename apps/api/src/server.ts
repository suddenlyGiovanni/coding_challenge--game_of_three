import { clearInterval } from 'timers'

import { Server as IOServer, Socket } from 'socket.io'

import type { ILobby, IPlayersStore, IServer } from './interfaces'
import { Human, Lobby } from './model'
import { PlayersStore } from './players-store'
import {
  SocketActionFn,
  broadcast,
  createSocket,
  emitToAllSockets,
  emitToSocket,
} from './sockets'

import { IEvents, SocketEvent } from '@game-of-three/contracts'

export class Server implements IServer {
  public static readonly CORS_ORIGIN: string = `http://localhost:4200`

  public static readonly PORT: number = 3000

  private static instance: Server

  private heartbeatTimerID: NodeJS.Timeout

  private readonly io: IOServer

  private readonly lobby: ILobby

  private readonly playersStore: IPlayersStore

  private readonly port: number

  private constructor() {
    this.port = Number(process.env.port) || Server.PORT
    this.io = new IOServer(this.port, {
      cors: {
        origin: [Server.CORS_ORIGIN],
      },
    })

    this.playersStore = PlayersStore.getInstance()
    this.lobby = Lobby.getInstance()

    console.log(`Listening at ws://localhost:${this.port}`)
  }

  public static getInstance(): Server {
    if (!Server.instance) {
      Server.instance = new Server()
    }
    return Server.instance
  }

  public getIO(): IOServer {
    return this.io
  }

  public listen = (): void => {
    this.io.on(
      SocketEvent.INTERNAL_CONNECTION,
      this._registerSocketToEventListeners
    )
    this._startEmitHeartbeat()
  }

  public stop(): void {
    this._stopEmitHeartbeat()
    this.io.close()
  }

  private _addPlayerToLobby(playerId: PlayerID): void {
    const player = this.playersStore.getPlayerByID(playerId)

    if (!this.lobby.getPlayersId().includes(player.getId())) {
      this.lobby.addPlayerId(player.getId())
      console.info(`add player id ${player.getId()} to the lobby`)

      broadcast(this.io)(SocketEvent.LOBBY_PLAYER_JOINED, {
        payload: player.serialize(),
        type: SocketEvent.LOBBY_PLAYER_JOINED,
      })
    } else {
      console.info(`can't add player id ${player.getId()} to the lobby`)
    }
  }

  private _handlerClientInitializeData = (socket: Socket) => {
    const actionInitialize = {
      payload: {
        lobby: this.lobby.getPlayersId(),
        players: this.playersStore.getSerializedPlayer(),
      },
      type: SocketEvent.SYSTEM_INITIALIZE,
    } as const
    emitToSocket(socket)(SocketEvent.SYSTEM_INITIALIZE, actionInitialize)
  }

  private _handlerEventHello: SocketActionFn<
    IEvents[SocketEvent.SYSTEM_HELLO]
  > = (socket) => (action) => {
    const { id } = socket
    const { payload } = action
    console.log(`user message '${payload}' id: ${id}`) // TODO: remove this console.log
  }

  private _handlerMatchMaking: SocketActionFn<
    IEvents[SocketEvent.LOBBY_MAKE_MATCH]
  > = (socket) => ({ type }) => {
    console.log(`user id: ${socket.id} - match making '${type}'`)
  }

  private _handlerMatchMove: SocketActionFn<IEvents[SocketEvent.MATCH_MOVE]> = (
    socket
  ) => (action) => {
    // route the match move to the correct match ('room')
    const { id } = socket
    const { payload: move } = action
    console.log(`user id: ${id} - match move: ${move}`) // TODO: remove this console.log
  }

  private _handlerNameUpdate: SocketActionFn<
    IEvents[SocketEvent.SYSTEM_NAME_UPDATE]
  > = (socket) => (action) => {
    const { id } = socket
    const { payload: name } = action
    // update user name
    // 1. get player
    // 2. update name
    // 3. notify clients of name changes
    // 4. add player to the lobby
    // 5. emit to all players that he has joined the lobby

    this._renamePlayer(id, name)

    this._addPlayerToLobby(id)
  }

  private _handlerUserConnect = (socket: Socket) => {
    const { id } = socket
    console.log(`user connected id: ${id}`) // TODO: remove this console.log
    // add user to the store
    const player = new Human(id)
    this.playersStore.addPlayer(player)

    // notify socket of who is online
    this._handlerClientInitializeData(socket)

    // notify all connected clients (except this client) that a new client has joined
    emitToAllSockets(socket)(SocketEvent.SYSTEM_PLAYER_JOINED, {
      payload: player.serialize(),
      type: SocketEvent.SYSTEM_PLAYER_JOINED,
    })
  }

  private _handlerUserDisconnect: SocketActionFn<
    IEvents[SocketEvent.INTERNAL_DISCONNECT]
  > = (socket) => () => {
    const { id } = socket
    console.log(`user disconnected id: ${id}`) // TODO: remove this console.log

    // 1. verify the socket id is in the player store
    //  1.1 remove the player from the player sore
    //  1.2 notify the clients the player has disconnected
    // 2. verify if the player was also in the lobby
    //  2.1 remove the player from the lobby
    //  2.2 notify the clients a player has left the lobby
    // 3 handle the case where a player was in a match

    const player = this.playersStore.getPlayerByID(id)
    if (player) {
      this._removePlayerFromLobby(player)
      this._removePlayerFromStore(player)
    }
  }

  private _registerSocketToEventListeners = (socket: Socket): void => {
    const registeredEvents = [
      createSocket(
        SocketEvent.INTERNAL_DISCONNECT,
        this._handlerUserDisconnect
      ),
      createSocket(SocketEvent.SYSTEM_HELLO, this._handlerEventHello),
      createSocket(SocketEvent.SYSTEM_NAME_UPDATE, this._handlerNameUpdate),

      createSocket(SocketEvent.MATCH_MOVE, this._handlerMatchMove),

      createSocket(SocketEvent.LOBBY_MAKE_MATCH, this._handlerMatchMaking),
    ] as const

    registeredEvents.forEach(({ callback, event }) =>
      socket.on(event, callback(socket))
    )

    this._handlerUserConnect(socket)
  }

  /**
   * removes a IPlayer from the Lobby
   * and notifies all the clients of such change
   * @emits `SocketEvent.LOBBY_PLAYER_LEFT`
   * @private
   * @param {Human<string>} player
   * @memberof Server
   */
  private _removePlayerFromLobby(player: Human<string>): void {
    if (this.lobby.getPlayersId().includes(player.getId())) {
      console.info(`remove player id ${player.getId()} from lobby`)
      this.lobby.removePlayerId(player.getId())

      broadcast(this.io)(SocketEvent.LOBBY_PLAYER_LEFT, {
        payload: player.serialize(),
        type: SocketEvent.LOBBY_PLAYER_LEFT,
      })
    }
  }

  /**
   * removes a IPlayer from the playerStore
   * and notifies all the clients of such change
   * @event `SocketEvent.SYSTEM_PLAYER_LEFT`
   * @private
   * @param {Human<string>} player
   * @memberof Server
   */
  private _removePlayerFromStore(player: Human<string>): void {
    console.info(`remove player id ${player.getId()} from playerStore`)

    this.playersStore.removePlayerByID(player.getId())
    broadcast(this.io)(SocketEvent.SYSTEM_PLAYER_LEFT, {
      payload: player.serialize(),
      type: SocketEvent.SYSTEM_PLAYER_LEFT,
    })
  }

  private _renamePlayer(id: string, name: string): void {
    const player = this.playersStore.getPlayerByID(id)
    player.setName(name)

    console.log(`user id: ${id} - name changed: ${name}`) // TODO: remove this console.log

    broadcast(this.io)(SocketEvent.SYSTEM_NAME_CHANGED, {
      payload: this.playersStore.getPlayerByID(id).serialize(),
      type: SocketEvent.SYSTEM_NAME_CHANGED,
    })
  }

  private _startEmitHeartbeat(): void {
    const _broadcast = broadcast(this.io)
    const action = () =>
      ({
        payload: new Date().toISOString(),
        type: SocketEvent.SYSTEM_HEARTBEAT,
      } as const)

    this.heartbeatTimerID = setInterval(
      () => _broadcast(SocketEvent.SYSTEM_HEARTBEAT, action()),
      1000
    )
  }

  private _stopEmitHeartbeat(): void {
    clearInterval(this.heartbeatTimerID)
  }
}
