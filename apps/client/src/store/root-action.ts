import * as connectionFeature from '../features/connection'
import * as lobbyFeatures from '../features/lobby'
import * as matchFeature from '../features/match'
import * as messagesFeature from '../features/messages'
import { socketActions } from '../features/socket'
import * as systemFeature from '../features/system'

export default {
  connection: connectionFeature.actions,
  lobby: lobbyFeatures.actions,
  match: matchFeature.actions,
  messages: messagesFeature.actions,
  socket: socketActions,
  system: systemFeature.actions,
}
