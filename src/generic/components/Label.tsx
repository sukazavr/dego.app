import React from 'react';
import { classes, style } from 'typestyle';

import { tv } from '../supply/style-helpers';
import { fontRegular } from '../theme';

interface IProps extends React.HTMLAttributes<HTMLSpanElement> {}

export const Label = React.forwardRef<HTMLSpanElement, IProps>(
  ({ children, className, ...rest }, ref) => {
    return (
      <span {...rest} ref={ref} className={classes($container, className)}>
        {children}
      </span>
    );
  }
);

const $container = style(fontRegular, {
  color: tv('base500'),
  padding: '.6rem 0',
});
