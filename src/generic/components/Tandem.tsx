import React from 'react';
import { style } from 'typestyle';

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  left: React.ReactNode;
  leftMax?: number;
  leftLoose?: boolean;
  right: React.ReactNode;
  rightAlign?: 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';
}

export const Tandem = React.forwardRef<HTMLDivElement, IProps>(
  ({ left, leftMax, leftLoose = false, right, rightAlign, className, ...rest }, ref) => {
    return (
      <div {...rest} ref={ref} className={$container}>
        <div
          className={$child}
          style={{ maxWidth: leftMax, flexBasis: leftLoose ? 'auto' : undefined }}
        >
          {left}
        </div>
        <div className={$child} style={{ alignItems: rightAlign }}>
          {right}
        </div>
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
