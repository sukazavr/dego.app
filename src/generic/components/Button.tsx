import React from 'react';
import { classes, style } from 'typestyle';

import { TIconName } from '../icons';
import { applyVariables, tv } from '../supply/style-helpers';
import { isDefined, isPresent } from '../supply/type-guards';
import { fontRegularBig } from '../theme';
import { Icon } from './Icon';

interface IProps extends React.HTMLAttributes<HTMLButtonElement> {
  isActive?: boolean;
  icon?: TIconName;
  iconRotate?: 1 | 2 | 3; // 1 = 90deg, 2 = 180deg, 3 = 270deg
}

export const Button = React.forwardRef<HTMLButtonElement, IProps>(
  ({ icon, iconRotate, isActive = false, children, className, ...rest }, ref) => {
    return (
      <button
        type="button"
        {...rest}
        ref={ref}
        className={classes($buttonContainer, isActive && $buttonIsActive, className)}
      >
        {isDefined(icon) && <Icon icon={icon} rotate={iconRotate} size="3rem" />}
        {isPresent(children) && <span>{children}</span>}
      </button>
    );
  }
);

export const $buttonContainer = style(
  fontRegularBig,
  applyVariables({
    'color-btn': tv('select500'),
    'color-btn-bg': tv('select100'),
    'color-btn-border': tv('select500'),
  }),
  {
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
    height: '3.25rem',
    minWidth: '3.25rem',
    backgroundColor: 'var(--color-btn-bg)',
    border: '1px solid var(--color-btn-border)',
    color: 'var(--color-btn)',
    whiteSpace: 'nowrap',
    textDecoration: 'none',
    outline: 'none',
    userSelect: 'none',
    cursor: 'pointer',
    $nest: {
      '& span': {
        padding: '0 .8rem',
      },
      '& svg + span': {
        paddingLeft: '.4rem',
        lineHeight: '17px',
      },
    },
  }
);

export const $buttonIsActive = style(
  applyVariables({
    'color-btn': tv('select100'),
    'color-btn-bg': tv('select500'),
    'color-btn-border': tv('base500'),
  })
);
