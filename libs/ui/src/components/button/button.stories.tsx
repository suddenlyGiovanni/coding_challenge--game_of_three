// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import type { Meta, Story } from '@storybook/react/types-6-0'
import type { ComponentProps } from 'react'
import React from 'react'

import { Button } from './button'

// This default export determines where your story goes in the story list
const story: Meta = {
  argTypes: {
    backgroundColor: { control: 'color' },
  },
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  component: Button,
  title: 'Example/Button',
}

const Template: Story<ComponentProps<typeof Button>> = (args) => (
  <Button {...args} />
)

export const Primary = Template.bind({}) as typeof Template
Primary.args = {
  /* the args you need here will depend on your component */
  label: 'Button',
  primary: true,
}

export const Secondary = Template.bind({}) as typeof Template
Secondary.args = {
  label: 'Button',
}

export const Large = Template.bind({}) as typeof Template
Large.args = {
  label: 'Button',
  size: 'large',
}

export const Small = Template.bind({}) as typeof Template
Small.args = {
  label: 'Button',
  size: 'small',
}

export default story
