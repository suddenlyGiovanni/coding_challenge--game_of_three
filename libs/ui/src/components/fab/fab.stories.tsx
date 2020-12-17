import type { Meta, Story } from '@storybook/react'
import React from 'react'
import type { ComponentProps } from 'react'

import { FAB } from './fab'

const meta: Meta = {
  argTypes: {
    onClick: { action: 'clicked' },
  },
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  component: FAB,
  title: 'FAB',
}
export default meta

const Template: Story<ComponentProps<typeof FAB>> = (args) => <FAB {...args} />

export const Default = Template.bind({}) as typeof Template
Default.args = {
  label: '+',
}

export const AddNegativeOne = Template.bind({}) as typeof Template
AddNegativeOne.args = {
  label: '- 1',
}

export const AddZero = Template.bind({}) as typeof Template
AddZero.args = {
  label: '0',
}

export const AddPlusOne = Template.bind({}) as typeof Template
AddPlusOne.args = {
  label: '+ 1',
}
