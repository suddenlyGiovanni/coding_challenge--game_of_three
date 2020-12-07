/* eslint-disable @typescript-eslint/no-unused-vars */
// eslint-disable-next-line import/no-unresolved
import type { RootEpic } from '@MyTypes'

import { combineEpics, ofType } from 'redux-observable'
import { filter, ignoreElements, map, mapTo } from 'rxjs/operators'

import socketService from '../../services/socket-service'

import store from '../../store'

import * as connectionFeature from '../connection'
import * as lobbyFeature from '../lobby'
import * as matchFeature from '../match'
import * as messagesFeature from '../messages'
import * as socketFeature from '../socket'
import * as systemFeature from '../system'

//#region SocketService Observers:
const internalConnection$ = socketService.onInternalConnection()
const internalDisconnection$ = socketService.onInternalDisconnection()
const systemHeartbeat$ = socketService.onSystemHeartbeat()
const systemInitialize$ = socketService.onSystemInitialize()
const systemPlayerJoined$ = socketService.onSystemPlayerJoined()
const systemPlayerLeft$ = socketService.onSystemPlayerLeft()
const systemPlayerUpdated$ = socketService.onSystemPlayerUpdated()
const lobbyPlayerJoined$ = socketService.onLobbyPlayerJoined()
const lobbyPlayerLeft$ = socketService.onLobbyPlayerLeft()
const matchNewState$ = socketService.onMatchNewState()
const matchEnded$ = socketService.onMatchEnded()
const matchError$ = socketService.onMatchError()
//#endregion

//#region OBSERVER SUBSCRIPTIONS

internalConnection$.subscribe(() =>
  store.dispatch(socketFeature.socketActions.internalConnection())
)

internalDisconnection$.subscribe((event) =>
  store.dispatch(socketFeature.socketActions.internalDisconnect(event))
)

systemHeartbeat$.subscribe((event) =>
  store.dispatch(socketFeature.socketActions.systemHeartbeat(event))
)
systemInitialize$.subscribe((event) =>
  store.dispatch(socketFeature.socketActions.systemInitialize(event))
)

systemPlayerJoined$.subscribe((event) =>
  store.dispatch(socketFeature.socketActions.systemPlayerJoined(event))
)

systemPlayerLeft$.subscribe((event) =>
  store.dispatch(socketFeature.socketActions.systemPlayerLeft(event))
)

systemPlayerUpdated$.subscribe((event) =>
  store.dispatch(socketFeature.socketActions.systemPlayerUpdated(event))
)

lobbyPlayerJoined$.subscribe((event) =>
  store.dispatch(socketFeature.socketActions.lobbyPlayerJoined(event))
)

lobbyPlayerLeft$.subscribe((event) =>
  store.dispatch(socketFeature.socketActions.lobbyPlayerLeft(event))
)

matchNewState$.subscribe((event) =>
  store.dispatch(socketFeature.socketActions.matchNewState(event))
)

matchEnded$.subscribe((event) =>
  store.dispatch(socketFeature.socketActions.matchEnded(event))
)

matchError$.subscribe((event) =>
  store.dispatch(socketFeature.socketActions.matchError(event))
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
