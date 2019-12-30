import React from 'react';
import { style } from 'typestyle';

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  middle?: number;
  left: React.ReactNode;
  right: React.ReactNode;
}

export const Tandem = React.forwardRef<HTMLDivElement, IProps>(
  ({ middle, left, right, className, ...rest }, ref) => {
    return (
      <div {...rest} ref={ref} className={$container}>
        <div className={$child} style={{ maxWidth: middle }}>
          {left}
        </div>
        <div className={$child}>{right}</div>
      </div>
    );
  }
);

const $container = style({
  display: 'flex',
  alignItems: 'center',
});

const $child = style({
  flex: '1 1 0',
  display: 'flex',
  flexDirection: 'column',
  $nest: {
    '& + &': {
      marginLeft: '1rem',
    },
  },
});
