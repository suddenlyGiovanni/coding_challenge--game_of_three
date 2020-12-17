import type { Meta, Story } from '@storybook/react/types-6-0'
import React from 'react'
import type { ComponentProps } from 'react'

import { Avatar } from './avatar'

const meta: Meta = {
  argTypes: { onClick: { action: 'clicked' } },
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  component: Avatar,
  title: 'Avatar',
}

const Template: Story<ComponentProps<typeof Avatar>> = (args) => (
  <Avatar {...args} />
)

export const Default = Template.bind({}) as typeof Template
Default.args = {
  children: <span style={{ color: 'white' }}>GR</span>,
}

export default meta
