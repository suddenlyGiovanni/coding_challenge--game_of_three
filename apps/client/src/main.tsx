import React from 'react'
import { render } from 'react-dom'
import { Provider as ReduxProvider } from 'react-redux'

import { App } from './app/app'
import socketService from './services/socket-service'
import store from './store'

const $container: HTMLElement = document.getElementById('root')

const Element: JSX.Element = (
  <React.StrictMode>
    <ReduxProvider store={store}>
      <App />
    </ReduxProvider>
  </React.StrictMode>
)

render(Element, $container)
