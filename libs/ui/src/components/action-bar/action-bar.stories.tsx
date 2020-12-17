import { css } from '@emotion/react'
import type { Meta, Story } from '@storybook/react'
import React from 'react'
import type { ComponentProps } from 'react'

import { FAB } from '../fab/fab'

import { ActionBar } from './action-bar'

const story: Meta = {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  component: ActionBar,
  decorators: [
    (Story) => (
      <div
        css={css`
          position: relative;

          max-width: 320px;
          max-height: 568px;
          margin: 0 auto;
          padding: 0 0.5rem;
          overflow-y: auto;
        `}
      >
        <div
          css={css`
            padding-bottom: 1rem;
          `}
        >
          <p>Some text some text some text some text..</p>
          <p>Some text some text some text some text..</p>
          <p>Some text some text some text some text..</p>
          <p>Some text some text some text some text..</p>
          <p>Some text some text some text some text..</p>
          <p>Some text some text some text some text..</p>
          <p>Some text some text some text some text..</p>
          <p>Some text some text some text some text..</p>
          <p>Some text some text some text some text..</p>
          <p>Some text some text some text some text..</p>
          <p>Some text some text some text some text..</p>
          <p>Some text some text some text some text..</p>
          <p>Some text some text some text some text..</p>
          <p>Some text some text some text some text..</p>
          <p>Some text some text some text some text..</p>
          <p>Some text some text some text some text..</p>
          <p>Some text some text some text some text..</p>
          <p>Some text some text some text some text..</p>
          <p>Some text some text some text some text..</p>
          <p>Some text some text some text some text..</p>
        </div>
        <Story />
      </div>
    ),
  ],
  title: 'ActionBar',
}

const Template: Story<ComponentProps<typeof ActionBar>> = (args) => (
  <ActionBar {...args} />
)

export const Default = Template.bind({}) as typeof Template
Default.args = {
  children: (
    <>
      <FAB label={'-1'} />
      <FAB label={'0'} />
      <FAB label={'+1'} />
    </>
  ),
}

export default story
