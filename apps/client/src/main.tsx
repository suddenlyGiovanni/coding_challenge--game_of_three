import React, { StrictMode } from 'react'
import { render } from 'react-dom'

import { App } from './app/app'

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const $container: HTMLElement = document.getElementById('root')!

const Element: JSX.Element = (
  <StrictMode>
    <App />
  </StrictMode>
)

render(Element, $container)
