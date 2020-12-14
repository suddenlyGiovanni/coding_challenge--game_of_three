import { css } from '@emotion/core'
import React from 'react'

import type { FC, HTMLAttributes, ReactNode } from 'react'

import { typography } from '../../styles'

const styles = {
  container: css`
    position: relative;

    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;

    background-color: rgba(165, 166, 169, 0.77);
    border-radius: 50%;
  `,
  contentTypography: typography.BUTTON(),
}

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Avatar contents
   * @type {ReactNode}
   * @memberof AvatarProps
   */
  children: ReactNode
}

export const Avatar: FC<AvatarProps> = ({ children, ...props }) => (
  <div {...props} css={[styles.container, styles.contentTypography]}>
    {children}
  </div>
)
