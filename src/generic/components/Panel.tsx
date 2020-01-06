import React from 'react';
import { classes, style } from 'typestyle';

import { applyVariables, av, tv } from '../supply/style-helpers';
import { Label } from './Label';

interface IProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title: React.ReactNode;
  isTransparent?: boolean;
}

export const Panel = React.forwardRef<HTMLDivElement, IProps>(
  ({ title, isTransparent = false, children, className, ...rest }, ref) => {
    return (
      <div
        {...rest}
        ref={ref}
        className={classes($container, isTransparent && $isTransparent, className)}
      >
        <Label children={title} className={$title} />
        {children}
      </div>
    );
  }
);

const $container = style(
  applyVariables({
    'color-bg': tv('base100'),
  }),
  {
    display: 'flex',
    alignItems: 'center',
    padding: '0 1rem',
    minHeight: '3.25rem',
    backgroundColor: av('color-bg'),
  }
);

const $isTransparent = style(
  applyVariables({
    'color-bg': 'transparent',
  }),
  {
    borderTop: `1px solid ${tv('base100')}`,
  }
);

const $title = style({
  flexGrow: 1,
});
