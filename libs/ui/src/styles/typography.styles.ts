/* eslint-disable sort-keys */
import { css } from '@emotion/core'

import { colors } from './colors.styles'
export const typography = {
  /* H1 Headline */
  H1head: (color?: string) => css`
    font-family: Inter;
    font-style: normal;
    font-weight: 600;
    font-size: 6rem;
    line-height: 7.25rem;
    letter-spacing: -1.5px;
    color: ${color ? color : colors.main};
  `,

  /* H2 Headline */
  H2headline: (color?: string) => css`
    font-family: Inter;
    font-style: normal;
    font-weight: 600;
    font-size: 3.75rem;
    line-height: 4.563rem;
    color: ${color ? color : colors.main};
  `,

  /* H3 Headline */
  H3headline: (color?: string) => css`
    font-family: Inter;
    font-style: normal;
    font-weight: 600;
    font-size: 3rem;
    line-height: 3.625rem;
    color: ${color ? color : colors.main};
  `,

  /* H4 Headline */
  H4headline: (color?: string) => css`
    font-family: Inter;
    font-style: normal;
    font-weight: 600;
    font-size: 2.125rem;
    line-height: 2.563rem;
    letter-spacing: 0.016rem;
    color: ${color ? color : colors.main};
  `,

  /* H5 Headline */
  H5headline: (color?: string) => css`
    font-family: Inter;
    font-style: normal;
    font-weight: 600;
    font-size: 1.5rem;
    line-height: 1.813rem;
    color: ${color ? color : colors.main};
  `,

  /* H6 Headline */
  H6headline: (color?: string) => css`
    font-family: Inter;
    font-style: normal;
    font-weight: 600;
    font-size: 1.25rem;
    line-height: 1.75rem;
    letter-spacing: 0.009rem;
    color: ${color ? color : colors.main};
  `,

  /* Body 1 */
  Body1: (color?: string) => css`
    font-family: Inter;
    font-style: normal;
    font-weight: normal;
    font-size: 1rem;
    line-height: 1.5rem;
    letter-spacing: 0.01em;
    color: ${color ? color : colors.main};
  `,

  /* Subtitle 2 */
  Subtitle2: (color?: string) => css`
    font-family: Inter;
    font-style: normal;
    font-weight: 500;
    font-size: 0.875rem;
    line-height: 1.5rem;
    letter-spacing: 0.006rem;
    color: ${color ? color : colors.main};
  `,
  /* BUTTON */
  BUTTON: (color?: string) => css`
    font-family: Inter;
    font-style: normal;
    font-weight: 500;
    font-size: 0.875rem;
    line-height: 1.063rem;
    letter-spacing: 0.047rem;
    text-transform: uppercase;
    color: ${color ? color : colors.main};
  `,

  /* Body 2 */
  Body2: (color?: string) => css`
    font-family: Inter;
    font-style: normal;
    font-weight: normal;
    font-size: 0.875rem;
    line-height: 1.25rem;
    letter-spacing: 0.005em;
    color: ${color ? color : colors.main};
  `,
}
