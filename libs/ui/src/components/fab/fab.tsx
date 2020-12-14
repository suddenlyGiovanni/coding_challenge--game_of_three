import { css } from '@emotion/react'
import React from 'react'

import type { ButtonHTMLAttributes, VFC } from 'react'

import { colors, typography } from '../../styles'

//#region STYLES
const styles = {
  button: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 50px;
    height: 50px;

    /* unset default button attributes */
    background-color: ${colors.primary};
    border: unset;
    outline: none;

    color: ${colors.white};

    border-radius: 50%;
    box-shadow: 0 6px 10px 0 #666;

    cursor: pointer;

    transition: all 0.1s ease-in-out;

    &:hover {
      box-shadow: 0 6px 14px 0 #666;
      transform: scale(1.05);
    }

    &:active {
      box-shadow: initial;
    }
  `,
  label: typography.BUTTON(colors.white),
}
//#endregion

export interface FABProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Button contents
   * @type {string}
   */
  label: string
}

export const FAB: VFC<FABProps> = ({ label, ...props }) => {
  return (
    <button css={styles.button} {...props}>
      <span css={styles.label}>{label}</span>
    </button>
  )
}
