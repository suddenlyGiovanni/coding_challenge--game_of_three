import type { Meta, Story } from '@storybook/react/types-6-0'
import React from 'react'
import type { ComponentProps } from 'react'

import { Action } from './action'

const meta: Meta = {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  component: Action,
  title: 'Action',
}

const Template: Story<ComponentProps<typeof Action>> = (args) => (
  <Action {...args} />
)

export const ActionPlusOne = Template.bind({}) as typeof Template
ActionPlusOne.args = {
  label: '+ 1',
}

export const ActionZero = Template.bind({}) as typeof Template
ActionZero.args = {
  label: '0',
}

export const ActionMinusOne = Template.bind({}) as typeof Template
ActionMinusOne.args = {
  label: '- 1',
}

export default meta
