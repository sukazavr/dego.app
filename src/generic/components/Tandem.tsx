import React from 'react';
import { style } from 'typestyle';

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  left: React.ReactNode;
  right: React.ReactNode;
  leader?: 'left' | 'right';
  spacing?: number | string;
  leftMax?: number | string;
  rightMax?: number | string;
  leftAlign?: 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';
  rightAlign?: 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';
}

export const Tandem = React.forwardRef<HTMLDivElement, IProps>(
  (
    {
      left,
      right,
      leader,
      spacing = '8px',
      leftMax,
      rightMax,
      leftAlign,
      rightAlign,
      className,
      ...rest
    },
    ref
  ) => {
    return (
      <div {...rest} ref={ref} className={$container}>
        <div
          className={$child}
          style={{
            flexBasis: leader === 'left' ? 'auto' : undefined,
            maxWidth: leftMax,
            alignItems: leftAlign,
          }}
        >
          {left}
        </div>
        <div
          className={$child}
          style={{
            marginLeft: spacing,
            flexBasis: leader === 'right' ? 'auto' : undefined,
            maxWidth: rightMax,
            alignItems: rightAlign,
          }}
        >
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
});
