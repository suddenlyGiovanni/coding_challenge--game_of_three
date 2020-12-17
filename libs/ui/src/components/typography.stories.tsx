import type { SerializedStyles } from '@emotion/core'
import type { Meta, Story } from '@storybook/react'
import React from 'react'

import type { FC, HTMLAttributes, PropsWithChildren } from 'react'

import { typography } from '../styles'

interface TypographyProps
  extends PropsWithChildren<HTMLAttributes<HTMLSpanElement>> {
  /**
   * select the type of typography style
   * @type {('H1'
   *     | 'H2'
   *     | 'H3'
   *     | 'H4'
   *     | 'H5'
   *     | 'H6'
   *     | 'Body 1'
   *     | 'Body 2'
   *     | 'Subtitle 2'
   *     | 'BUTTON')}
   */
  typography:
    | 'H1'
    | 'H2'
    | 'H3'
    | 'H4'
    | 'H5'
    | 'H6'
    | 'Body 1'
    | 'Body 2'
    | 'Subtitle 2'
    | 'BUTTON'
}

const Typography: FC<TypographyProps> = ({
  typography: fontType = 'Body 1',
  ...props
}) => {
  const getStyles = (): SerializedStyles => {
    switch (fontType) {
      case 'H1':
        return typography.H1head()
      case 'H2':
        return typography.H2headline()
      case 'H3':
        return typography.H3headline()
      case 'H4':
        return typography.H4headline()
      case 'H5':
        return typography.H5headline()
      case 'H6':
        return typography.H6headline()
      case 'BUTTON':
        return typography.BUTTON()
      case 'Body 1':
        return typography.Body1()
      case 'Body 2':
        return typography.Body2()
      case 'Subtitle 2':
        return typography.Subtitle2()
    }
  }

  return <span {...props} css={getStyles()} />
}

const meta: Meta = {
  component: Typography,
  title: 'Typography',
}
export default meta

const Template: Story<TypographyProps> = (args) => <Typography {...args} />

export const H1Head = Template.bind({}) as Story<TypographyProps>
H1Head.args = {
  children: 'H1 Headline',
  typography: 'H1',
}

export const H2Headline = Template.bind({}) as Story<TypographyProps>
H2Headline.args = {
  children: 'H2 Headline',
  typography: 'H2',
}

export const H3Headline = Template.bind({}) as Story<TypographyProps>
H3Headline.args = {
  children: 'H3 Headline',
  typography: 'H3',
}

export const H4Headline = Template.bind({}) as Story<TypographyProps>
H4Headline.args = {
  children: 'H4 Headline',
  typography: 'H4',
}

export const H5Headline = Template.bind({}) as Story<TypographyProps>
H5Headline.args = {
  children: 'H5 Headline',
  typography: 'H5',
}

export const H6Headline = Template.bind({}) as Story<TypographyProps>
H6Headline.args = {
  children: 'H6 Headline',
  typography: 'H6',
}

export const Body1 = Template.bind({}) as Story<TypographyProps>
Body1.args = {
  children: 'Body 1',
  typography: 'Body 1',
}

export const Body2 = Template.bind({}) as Story<TypographyProps>
Body2.args = {
  children: 'Body 2',
  typography: 'Body 2',
}

export const Subtitle2 = Template.bind({}) as Story<TypographyProps>
Subtitle2.args = {
  children: 'Subtitle 2',
  typography: 'Subtitle 2',
}

export const BUTTON = Template.bind({}) as Story<TypographyProps>
BUTTON.args = {
  children: 'BUTTON',
  typography: 'BUTTON',
}
