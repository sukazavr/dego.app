import React from 'react';
import { classes, style } from 'typestyle';

import { tv } from '../../generic/supply/style-helpers';
import { fontRegularBig } from '../../generic/theme';

interface IProps extends React.HTMLAttributes<HTMLButtonElement> {
  isActive?: boolean;
  isDisabled?: boolean;
}

export const MenuItem = React.forwardRef<HTMLButtonElement, IProps>(
  ({ children, isActive = false, isDisabled = false, className, ...rest }, ref) => (
    <button
      type="button"
      data-close-ctx
      {...rest}
      ref={ref}
      disabled={isDisabled}
      className={classes($container, !isDisabled && isActive && $isActive, className)}
    >
      {children}
    </button>
  )
);

const $container = style(fontRegularBig, {
  display: 'block',
  width: '100%',
  padding: '.5rem 1rem',
  cursor: 'default',
  userSelect: 'none',
  color: tv('base500'),
  backgroundColor: tv('base'),
  border: 'none',
  outline: 'none',
  textAlign: 'left',
  textDecoration: 'none',
  whiteSpace: 'nowrap',
  $nest: {
    '&&:disabled': {
      color: tv('base300'),
      cursor: 'not-allowed',
    },
    '&:hover': {
      color: tv('base900'),
      backgroundColor: tv('select100'),
    },
  },
});

const $isActive = style({
  color: tv('base'),
  backgroundColor: tv('select500'),
});
