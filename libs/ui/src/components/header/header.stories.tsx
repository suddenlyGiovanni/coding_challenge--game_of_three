import { css } from '@emotion/react'
import type { Meta, Story } from '@storybook/react'
import React from 'react'
import type { ComponentProps } from 'react'

import { Header } from './header'

const story: Meta = {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  component: Header,
  decorators: [
    (Story) => (
      <div
        css={css`
          position: relative;
          width: 100%;
          height: 80vh;
          overflow-y: scroll;
        `}
      >
        <Story />
        <div
          css={css`
            height: 120vh;
            width: 100%;
            /* overflow-y: visible; */
            background-color: #f5f7fa;

            position: relative;
            height: 130vh;
            box-shadow: 2px 2px 5px;
            background: #fff;
            filter: contrast(7);
            --mask: linear-gradient(red, #{rgba(#000, 0.45)});

            &::before {
              position: absolute;
              top: 0;
              right: 0;
              bottom: 0;
              left: 0;
              background: radial-gradient(#000, transparent) 0 0/ 1em 1em space;
              -webkit-mask: var(--mask);
              mask: var(--mask);
              content: '';
            }
          `}
        />
      </div>
    ),
  ],
  title: 'Header',
}

const Template: Story<ComponentProps<typeof Header>> = (args) => (
  <Header {...args} />
)

export const DefaultHeader = Template.bind({}) as typeof Template
DefaultHeader.args = {}

export default story
