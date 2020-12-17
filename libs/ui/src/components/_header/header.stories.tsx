import type { Meta, Story } from '@storybook/react'
import React from 'react'
import type { ComponentProps } from 'react'

import { Header } from './header'

const story: Meta = {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  component: Header,
  title: 'Example/Header',
}

const Template: Story<ComponentProps<typeof Header>> = (args) => (
  <Header {...args} />
)

export const LoggedIn = Template.bind({}) as typeof Template
LoggedIn.args = {
  user: {},
}

export const LoggedOut = Template.bind({}) as typeof Template
LoggedOut.args = {}

export default story
