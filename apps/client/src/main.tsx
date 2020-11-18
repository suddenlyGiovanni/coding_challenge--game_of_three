import React from 'react'
import { render } from 'react-dom'

import { App } from './app/app'

const $container: HTMLElement = document.getElementById('root')

const Element: JSX.Element = (
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

render(Element, $container)
