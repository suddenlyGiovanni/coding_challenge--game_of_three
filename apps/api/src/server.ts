import { clearInterval } from 'timers'

import { Server as IOServer, Socket } from 'socket.io'

import type { ILobby, IPlayersStore, IServer } from './interfaces'
import { MatchService } from './match-service'
import { AI, Human, Lobby } from './model'
import { PlayersStore } from './players-store'
import {
  SocketActionFn,
  broadcast,
  createSocket,
  emitToAllSockets,
  emitToSocket,
} from './sockets'

import { IEvents, PlayerID, SocketEvent } from '@game-of-three/contracts'

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

  /**
   * add a player to the Lobby
   * and informs all clients that a Player has joined the lobby
   * @emits `SocketEvent.LOBBY_PLAYER_JOINED`
   * @private
   * @param {PlayerID} playerId
   * @memberof Server
   */
  private _addPlayerToLobby(playerId: PlayerID): void {
    const player = this.playersStore.getPlayerByID(playerId)

    if (!this.lobby.playersId.includes(player.id)) {
      this.lobby.addPlayerId(player.id)
      console.info(`add player id ${player.id} to the lobby`)

      broadcast(this.io)(SocketEvent.LOBBY_PLAYER_JOINED, {
        payload: player.id,
        type: SocketEvent.LOBBY_PLAYER_JOINED,
      })
    } else {
      console.info(`can't add player id ${player.id} to the lobby`)
    }
  }

  private _assertPlayerInLobby(playerId: PlayerID): void {
    if (!this.lobby.playersId.includes(playerId)) {
      throw new Error('Player is not in the lobby')
    }
  }

  private _createMatch(playerID1: PlayerID) {
    // 1. how many players are in the lobby?
    //    IF `ONE` DO:
    //        - remove this player from the lobby
    //        - notify this user has left the lobby
    //        - use matchmaking service to create a match against AI
    //    ELSE:
    //        - remove this player form the lobby
    //        - de-queue next player waiting in the lobby
    //        - notify all clients that these players are no longer in the lobby
    //        - use matchmaking service to create a match between these two clients

    this._assertPlayerInLobby(playerID1)

    if (this.lobby.size < 2) {
      // there are no other players in the lobby
      // case where a match must be played against an AI
      this.lobby.removePlayerId(playerID1)
      broadcast(this.io)(SocketEvent.LOBBY_PLAYER_LEFT, {
        payload: playerID1,
        type: SocketEvent.LOBBY_PLAYER_LEFT,
      })
      const player1 = this.playersStore.getPlayerByID(playerID1)
      const ai = AI.make()
      new MatchService({
        players: [player1, ai],
        sockets: [this.io.sockets.sockets.get(playerID1)],
      })
    } else {
      // case where match between two players
      const playerID2 = this.lobby.getNextPlayerId()
      const player1 = this.playersStore.getPlayerByID(playerID1)
      const player2 = this.playersStore.getPlayerByID(playerID2)

      broadcast(this.io)(SocketEvent.LOBBY_PLAYER_LEFT, {
        payload: playerID1,
        type: SocketEvent.LOBBY_PLAYER_LEFT,
      })

      broadcast(this.io)(SocketEvent.LOBBY_PLAYER_LEFT, {
        payload: playerID2,
        type: SocketEvent.LOBBY_PLAYER_LEFT,
      })

      const socketPlayer1 = this.io.sockets.sockets.get(playerID1)
      const socketPlayer2 = this.io.sockets.sockets.get(playerID2)
      new MatchService({
        players: [player1, player2],
        sockets: [socketPlayer1, socketPlayer2],
      })
    }
  }

  /**
   * notifies newly connected client of the server state
   * @emits `SocketEvent.SYSTEM_INITIALIZE`
   * @private
   * @memberof Server
   */
  private _handlerClientInitializeData = (socket: Socket) => {
    const actionInitialize = {
      payload: {
        lobby: this.lobby.playersId,
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
    const { id } = socket
    console.log(`user id: ${socket.id} - match making '${type}'`)
    this._createMatch(id)
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

  /**
   * register all the event handlers to typed sockets event
   * @private
   * @memberof Server
   */
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
    if (this.lobby.playersId.includes(player.id)) {
      console.info(`remove player id ${player.id} from lobby`)
      this.lobby.removePlayerId(player.id)

      broadcast(this.io)(SocketEvent.LOBBY_PLAYER_LEFT, {
        payload: player.id,
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
    console.info(`remove player id ${player.id} from playerStore`)

    this.playersStore.removePlayerByID(player.id)
    broadcast(this.io)(SocketEvent.SYSTEM_PLAYER_LEFT, {
      payload: player.serialize(),
      type: SocketEvent.SYSTEM_PLAYER_LEFT,
    })
  }

  private _renamePlayer(playerId: PlayerID, name: string): void {
    const player = this.playersStore.getPlayerByID(playerId)
    player.setName(name)

    console.log(`user id: ${playerId} - name changed: ${name}`) // TODO: remove this console.log

    broadcast(this.io)(SocketEvent.SYSTEM_NAME_CHANGED, {
      payload: this.playersStore.getPlayerByID(playerId).serialize(),
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
