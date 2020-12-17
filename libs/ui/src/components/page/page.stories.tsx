/* eslint-disable
  @typescript-eslint/no-unsafe-member-access,
  @typescript-eslint/no-unsafe-assignment
*/

import type { Meta, Story } from '@storybook/react'
import React from 'react'
import type { ComponentProps } from 'react'

import * as HeaderStories from '../_header/header.stories'

import { Page } from './page'

const story: Meta = {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  component: Page,
  title: 'Example/Page',
}

const Template: Story<ComponentProps<typeof Page>> = (args) => (
  <Page {...args} />
)

export const LoggedIn = Template.bind({})
LoggedIn.args = {
  ...HeaderStories.LoggedIn.args,
}

export const LoggedOut = Template.bind({})
LoggedOut.args = {
  ...HeaderStories.LoggedOut.args,
}

export default story
