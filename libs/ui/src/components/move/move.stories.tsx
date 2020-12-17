import type { Meta, Story } from '@storybook/react'
import React from 'react'
import type { ComponentProps } from 'react'

import { Move } from './move'

const story: Meta = {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  component: Move,
  decorators: [
    (Story) => (
      <div
        style={{
          backgroundColor: '#F5F7FA',
          margin: 'auto',
          width: 266,
        }}
      >
        <Story />
      </div>
    ),
  ],
  title: 'Move',
}

const Template: Story<ComponentProps<typeof Move>> = (args) => (
  <Move {...args} />
)

export const MoveLeft = Template.bind({}) as typeof Template
MoveLeft.args = {
  action: '- 1',
  avatarContent: 'GR',
  calculation: '[ ( -1 + 19 ) / 3 ] = 6',
  newValue: '6',
  side: 'left',
}

export const MoveRight = Template.bind({}) as typeof Template
MoveRight.args = {
  action: '0',
  avatarContent: 'AI',
  calculation: '[ ( 0 + 6 ) / 3 ] = 2',
  newValue: '2',
  side: 'right',
}

export default story
