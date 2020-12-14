// eslint-disable-next-line import/no-unresolved
import type { RootEpic } from '@MyTypes'

import { combineEpics, ofType } from 'redux-observable'
import { filter, ignoreElements, map, mapTo, tap } from 'rxjs/operators'

import socketService from '../../services/socket-service'

import store from '../../store'

import * as connectionFeature from '../connection'
import * as lobbyFeature from '../lobby'
import * as matchFeature from '../match'
import * as messagesFeature from '../messages'
import * as socketFeature from '../socket'
import * as systemFeature from '../system'

import { SocketEvent } from '@game-of-three/contracts'

//#region SocketService Observers:
const socketEvents$ = socketService.onEvent()
const internalConnection$ = socketService.onInternalConnection()
const internalDisconnection$ = socketService.onInternalDisconnection()
//#endregion

//#region OBSERVER SUBSCRIPTIONS

socketEvents$.subscribe((e) => {
  switch (e[0]) {
    case SocketEvent.SYSTEM_HEARTBEAT:
      store.dispatch(socketFeature.socketActions.systemHeartbeat(e[1]))
      break

    case SocketEvent.SYSTEM_INITIALIZE:
      store.dispatch(socketFeature.socketActions.systemInitialize(e[1]))
      break

    case SocketEvent.SYSTEM_PLAYER_JOINED:
      store.dispatch(socketFeature.socketActions.systemPlayerJoined(e[1]))
      break

    case SocketEvent.SYSTEM_PLAYER_LEFT:
      store.dispatch(socketFeature.socketActions.systemPlayerLeft(e[1]))
      break

    case SocketEvent.SYSTEM_NAME_CHANGED:
      store.dispatch(socketFeature.socketActions.systemPlayerUpdated(e[1]))
      break

    case SocketEvent.LOBBY_PLAYER_JOINED:
      store.dispatch(socketFeature.socketActions.lobbyPlayerJoined(e[1]))
      break

    case SocketEvent.LOBBY_PLAYER_LEFT:
      store.dispatch(socketFeature.socketActions.lobbyPlayerLeft(e[1]))
      break

    case SocketEvent.MATCH_NEW_STATE:
      store.dispatch(socketFeature.socketActions.matchNewState(e[1]))
      break

    case SocketEvent.MATCH_END_STATE:
      store.dispatch(socketFeature.socketActions.matchEnded(e[1]))
      break

    case SocketEvent.MATCH_MOVE_ERROR:
      store.dispatch(socketFeature.socketActions.matchError(e[1]))
      break

    default:
      console.warn(e)
      break
  }
})

internalConnection$.subscribe(() =>
  store.dispatch(socketFeature.socketActions.internalConnection())
)

internalDisconnection$.subscribe((event) =>
  store.dispatch(socketFeature.socketActions.internalDisconnect(event))
)

//#endregion

//#region SOCKET EPICS
const connectedEpic: RootEpic = (actions$) =>
  actions$.pipe(
    ofType(socketFeature.socketActions.internalConnection.type),
    mapTo(connectionFeature.actions.toggleConnected(true))
  )

const disconnectedEpic: RootEpic = (actions$) =>
  actions$.pipe(
    ofType(socketFeature.socketActions.internalDisconnect.type),
    mapTo(connectionFeature.actions.toggleConnected(false))
  )

const heartbeatEpic: RootEpic = (actions$) =>
  actions$.pipe(
    filter(socketFeature.isSystemHeartbeat),
    map(({ payload: { payload } }) => systemFeature.actions.heartbeat(payload))
  )

const systemInitializeEpic: RootEpic = (actions$) =>
  actions$.pipe(
    filter(socketFeature.isSystemInitialize),
    map(({ payload: { payload } }) => systemFeature.actions.initialize(payload))
  )

const systemUserNameUpdatedEpic: RootEpic = (
  actions$,
  state$,
  { socketService }
) =>
  actions$.pipe(
    filter(systemFeature.isUserNameUpdated),
    map((action) => {
      socketService.emitSystemNameUpdated(action.payload)
      return action
    }),
    ignoreElements()
  )

const systemPlayerJoinedEpic: RootEpic = (actions$) =>
  actions$.pipe(
    filter(socketFeature.isSystemPlayerJoined),
    map(({ payload: { payload } }) =>
      systemFeature.actions.playerAdded(payload)
    )
  )

const systemPlayerLeftEpic: RootEpic = (actions$) =>
  actions$.pipe(
    filter(socketFeature.isSystemPlayerLeft),
    map(({ payload: { payload } }) =>
      systemFeature.actions.playerRemoved(payload)
    )
  )

const systemPlayerUpdatedEpic: RootEpic = (actions$) =>
  actions$.pipe(
    filter(socketFeature.isSystemPlayerUpdated),
    map(({ payload: { payload } }) =>
      systemFeature.actions.playerUpdated(payload)
    )
  )

const lobbyPlayerJoinedEpic: RootEpic = (actions$) =>
  actions$.pipe(
    filter(socketFeature.isLobbyPlayerJoined),
    map(({ payload: { payload } }) =>
      lobbyFeature.actions.addPlayerToLobby(payload)
    )
  )

const lobbyPlayerLeftEpic: RootEpic = (actions$) =>
  actions$.pipe(
    filter(socketFeature.isLobbyPlayerLeft),
    map(({ payload: { payload } }) =>
      lobbyFeature.actions.removePlayerFromLobby(payload)
    )
  )

const messagesEpic: RootEpic = (actions$, _$, { socketService }) =>
  actions$.pipe(
    filter(messagesFeature.isGreet),
    map((action) => {
      socketService.emitSystemHello(action.payload)
      return action
    }),
    ignoreElements()
  )

const matchMoveEpic: RootEpic = (actions$, _$, { socketService }) =>
  actions$.pipe(
    filter(matchFeature.isMatchMove),
    tap((x) => console.log(x)),
    map((action) => {
      socketService.emitMatchMove(action.payload)
      return action
    }),
    ignoreElements()
  )

const matchNewMatchEpic: RootEpic = (actions$, _$, { socketService }) =>
  actions$.pipe(
    filter(matchFeature.isMatchNewGame),
    map((action) => {
      socketService.emitLobbyMakeMatch()
      return action
    }),
    ignoreElements()
  )

const matchNewStateEpic: RootEpic = (actions$, _$, { socketService }) =>
  actions$.pipe(
    filter(socketFeature.isMatchNewState),
    map((action) => matchFeature.actions.matchNewState(action.payload.payload))
  )

export const socketEpic = combineEpics(
  connectedEpic,
  disconnectedEpic,
  heartbeatEpic,
  systemInitializeEpic,
  systemPlayerJoinedEpic,
  systemPlayerLeftEpic,
  systemPlayerUpdatedEpic,
  systemUserNameUpdatedEpic,
  lobbyPlayerJoinedEpic,
  lobbyPlayerLeftEpic,
  messagesEpic,
  matchMoveEpic,
  matchNewMatchEpic,
  matchNewStateEpic
)
//#endregion
