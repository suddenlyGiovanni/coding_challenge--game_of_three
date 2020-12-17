import { css } from '@emotion/core'
import React from 'react'

import type { HTMLAttributes } from 'react'

const styles = {
  container: css`
    position: fixed;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 2;

    display: flex;
    flex-direction: row;
    justify-content: space-around;
    padding-top: 0.5rem;
    padding-bottom: 1rem;
    overflow: hidden;
  `,
}

export type ActionBarProps = HTMLAttributes<HTMLDivElement>
export const ActionBar: React.FC<ActionBarProps> = ({ children }) => (
  <div css={styles.container}>{children}</div>
)
