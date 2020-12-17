import { css } from '@emotion/react'
import React from 'react'
import type { FC, HTMLAttributes } from 'react'

import { colors } from '../../styles'

const styles = {
  header: css`
    position: fixed;
    top: 0;
    left: 0;
    z-index: 2;

    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    min-height: 4rem;
    padding: 1rem 2rem;

    color: ${colors.white};

    background-color: ${colors.primary};

    box-shadow: rgba(0, 0, 0, 0.53) 0px 6px 4px;
  `,
}

export const Header: FC<HTMLAttributes<HTMLElement>> = ({ children }) => (
  <header css={styles.header}>{children}</header>
)
