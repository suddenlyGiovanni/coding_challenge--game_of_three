import { createAction } from '@reduxjs/toolkit'

import { withPayloadType } from '../utils'

export const toggleConnected = createAction(
  'CONNECTION/TOGGLE',
  withPayloadType<boolean>()
)
