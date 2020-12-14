import type { Meta, Story } from '@storybook/react/types-6-0'
import React from 'react'
import type { ComponentProps } from 'react'

import { DisplayBlock } from './display-box'

const meta: Meta = {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  component: DisplayBlock,
  decorators: [
    (Story) => (
      <div
        style={{
          height: '80vh',
          overflowX: 'hidden',
          padding: '3rem',
          position: 'relative',
          width: '80vw',
        }}
      >
        <Story />
      </div>
    ),
  ],
  title: 'DisplayBlock',
}

const Template: Story<ComponentProps<typeof DisplayBlock>> = (args) => (
  <DisplayBlock {...args} />
)

export const FadeInLeft = Template.bind({}) as typeof Template
FadeInLeft.args = {
  children: '[ ( -1 + 19 ) / 3 ] = 6',
  fadeIn: 'left',
}

export const FadeInRight = Template.bind({}) as typeof Template
FadeInRight.args = {
  children: '6',
  fadeIn: 'right',
}

export default meta
