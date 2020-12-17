import { css, keyframes } from '@emotion/core'
import React from 'react'

import type { HTMLAttributes, ReactNode, VFC } from 'react'

import { Action, Avatar, DisplayBlock } from '../index'

const styles = (side: 'left' | 'right') => {
  const zoomInUp = keyframes`
    0% {
    opacity: 0;
    transform: scale3d(0.1, 0.1, 0.1) translate3d(0, 1000px, 0);
    animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);
  }
  60% {
    opacity: 1;
    transform: scale3d(0.475, 0.475, 0.475) translate3d(0, -60px, 0);
    animation-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1);
  }`

  return {
    avatar: css`
      margin-right: ${side === 'left' ? '0.5rem' : '0'};
      margin-left: ${side === 'right' ? '0.5rem' : '0'};
    `,

    container: css`
      position: relative;

      display: flex;
      flex-direction: ${side === 'left' ? 'row' : 'row-reverse'};
      align-items: flex-start;
      justify-content: flex-start;

      animation-name: ${zoomInUp};
      animation-duration: 2s;
      animation-fill-mode: both;

      max-width: unset;
      margin: unset;
      margin-bottom: 2rem;
      padding: unset;
      color: unset;
      font: unset;
    `,

    displayBlocks: css`
      min-width: 11rem;
      margin-top: 0.5rem;
    `,

    move: css`
      display: flex;
      flex-direction: column;
      align-items: ${side === 'left' ? 'flex-start' : 'flex-end'};
      justify-content: flex-start;
    `,
  }
}

export interface MoveProps extends HTMLAttributes<HTMLDivElement> {
  action: '- 1' | '0' | '+ 1'
  avatarContent: ReactNode
  calculation?: ReactNode
  newValue?: ReactNode
  side: 'left' | 'right'
}

export const Move: VFC<MoveProps> = ({
  action,
  avatarContent,
  side,
  calculation,
  newValue,
}) => {
  const { container, displayBlocks, move, avatar } = styles(side)
  return (
    <section css={container}>
      <Avatar css={avatar}>{avatarContent}</Avatar>
      <div css={move}>
        <Action label={action} />
        {calculation && (
          <DisplayBlock css={displayBlocks} fadeIn={side}>
            {calculation}
          </DisplayBlock>
        )}
        {newValue && (
          <DisplayBlock css={displayBlocks} fadeIn={side}>
            {newValue}
          </DisplayBlock>
        )}
      </div>
    </section>
  )
}
