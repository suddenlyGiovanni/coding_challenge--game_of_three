import { css } from '@emotion/react'
import React from 'react'

import type { HTMLAttributes, VFC } from 'react'

import { typography } from '../../styles'
import { colors } from '../../styles/colors.styles'

interface Props extends HTMLAttributes<HTMLDivElement> {
  /**
   * Action contents
   * @type {('- 1' |  '0' | '+ 1')}
   * @memberof ActionProps
   */
  label: '- 1' | '0' | '+ 1'
}

const styles = {
  container: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 50px;
    height: 50px;

    background-color: ${colors.primary};

    border-radius: 50%;
  `,
  content: typography.BUTTON(colors.white),
} as const

export const Action: VFC<Props> = ({ label, ...props }) => {
  return (
    <div
      css={[styles.container, styles.content]}
      {...props}
      data-action={label}
    >
      <span>{label}</span>
    </div>
  )
}
