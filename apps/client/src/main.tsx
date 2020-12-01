import React, { StrictMode } from 'react'
import { render } from 'react-dom'
import { Provider as ReduxProvider } from 'react-redux'

import { App } from './app/app'
import { store } from './store'

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const $container: HTMLElement = document.getElementById('root')!

const Element: JSX.Element = (
  <StrictMode>
    <ReduxProvider store={store}>
      <App />
    </ReduxProvider>
  </StrictMode>
)

render(Element, $container)
