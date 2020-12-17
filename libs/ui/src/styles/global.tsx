import { Global } from '@emotion/react'
import React from 'react'

import { global } from './global.styles'
import { reset } from './reset.styles'

export const GlobalStyles = (): JSX.Element => (
  <>
    <Global styles={reset} />
    <Global styles={global} />
  </>
)
