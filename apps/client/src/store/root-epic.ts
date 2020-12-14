import { combineEpics } from 'redux-observable'

import * as socketFeature from '../features/socket'

export default combineEpics(socketFeature.socketEpic)
