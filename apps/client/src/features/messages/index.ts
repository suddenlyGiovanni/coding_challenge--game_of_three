import { createAction } from '@reduxjs/toolkit'
import type { AnyAction } from '@reduxjs/toolkit'

import { withPayloadType } from '../utils'

const greet = createAction('MESSAGES/GREET', withPayloadType<'world!'>())
export const isGreet = (
  action: AnyAction
): action is ReturnType<typeof greet> => greet.match(action)

export const actions = { greet }
