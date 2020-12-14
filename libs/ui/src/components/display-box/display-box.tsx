import { css, keyframes } from '@emotion/core'
import React from 'react'
import type { FC, HTMLAttributes, PropsWithChildren } from 'react'

import { colors, typography } from '../../styles'

const fadeInKeyframes = (fadeIn: 'left' | 'right') => keyframes`
  0% {
    transform: translate3d(${fadeIn === 'right' ? '' : '-'}2000px, 0, 0)}
    opacity: 0;
  }
  100% {
    transform: none;
    opacity: 1;
  }
`

const styles = {
  container: (fadeIn: 'left' | 'right') => css`
    background: ${colors.white};
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);

    padding: 0.5rem 0.875rem;
    border-radius: 2px;

    animation-name: ${fadeInKeyframes(fadeIn)};
    animation-duration: 1s;
    animation-fill-mode: both;
  `,
  content: typography.Body2(),
}

export interface ButtonProps
  extends PropsWithChildren<HTMLAttributes<HTMLDivElement>> {
  /**
   * select the origin of the animation
   * @type {('left' | 'right')}
   * @memberof ButtonProps
   */
  fadeIn?: 'left' | 'right'
}

/**
 * A canvas where to display the game computation
 */
export const DisplayBlock: FC<ButtonProps> = ({
  children,
  fadeIn = 'left',
  ...props
}) => (
  <div
    css={[styles.container(fadeIn), styles.content]}
    {...props}
    children={children}
  />
)
