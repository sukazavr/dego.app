import React from 'react';
import { classes, style } from 'typestyle';

import { horizontalSpaced } from '../supply/style-helpers';
import { $buttonContainer, $buttonIsActive } from './Button';

export const ButtonGroup = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...rest }, ref) => {
    return <div {...rest} ref={ref} className={classes($container, className)} />;
  }
);

const $container = style(horizontalSpaced('-1px'), {
  display: 'flex',
  $nest: {
    [`.${$buttonContainer}`]: {
      flex: '1 1 0',
    },
    [`.${$buttonIsActive}`]: {
      zIndex: 1,
    },
  },
});
