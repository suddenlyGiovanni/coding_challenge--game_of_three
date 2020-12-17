import { addDecorator } from '@storybook/react'
import { withKnobs } from '@storybook/addon-knobs'

import { GlobalStyles } from '../src/styles'

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
}

addDecorator(withKnobs)

// Global Styles ==============================
addDecorator((story) => (
  <>
    <GlobalStyles />
    {story()}
  </>
))
