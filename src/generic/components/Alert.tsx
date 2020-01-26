import React from 'react';
import { classes, style } from 'typestyle';

import { TIconName } from '../icons';
import { tv, verticalSpaced } from '../supply/style-helpers';
import { fontRegular } from '../theme';
import { Icon } from './Icon';

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: TIconName;
  text: string;
}

export const Alert = React.forwardRef<HTMLDivElement, IProps>(
  ({ className, icon, text, ...rest }, ref) => {
    return (
      <div {...rest} ref={ref} className={classes($container, className)}>
        <Icon icon={icon} size="6rem" />
        <div className={$text}>{text}</div>
      </div>
    );
  }
);

const $container = style(verticalSpaced('1rem'), {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '2rem 1rem',
  color: tv('base300'),
});

const $text = style(fontRegular, {
  textAlign: 'center',
});
