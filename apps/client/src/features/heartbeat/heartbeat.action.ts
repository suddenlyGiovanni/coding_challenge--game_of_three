import { createAction } from '@reduxjs/toolkit'

import { withPayloadType } from '../utils'

import type { DateISOString } from './heartbeat.reducer'

export const syncHeartbeat = createAction(
  'HEARTBEAT/SYNC',
  withPayloadType<DateISOString>()
)
