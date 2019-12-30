import React from 'react';
import { classes, style } from 'typestyle';

import { verticalSpaced } from '../supply/style-helpers';

export const TandemGroup = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...rest }, ref) => {
    return <div {...rest} ref={ref} className={classes($container, className)} />;
  }
);

const $container = style(verticalSpaced('1rem'), {
  padding: '2rem 1rem',
});
