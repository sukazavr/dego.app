import React from 'react';
import { classes, style } from 'typestyle';

import { Atom } from '@grammarly/focal';

import { useObservable } from '../supply/react-helpers';
import { applyVariables, tv } from '../supply/style-helpers';

interface IProps {
  isActive$: Atom<boolean>;
  onClick?: () => void;
}

export const Switcher = React.memo<IProps>(
  ({ isActive$, onClick = () => isActive$.modify((_) => !_) }) => {
    const isActive = useObservable(isActive$);
    return (
      <div className={classes($container, isActive && $active)} onClick={onClick}>
        <div className={$switcher}>
          <div className={$handle} />
        </div>
      </div>
    );
  }
);

const $container = style(
  applyVariables({
    'color-bg': tv('base300'),
    shift: '0',
  }),
  {
    width: '3.25rem',
    height: '2rem',
    padding: '.625rem 0',
    userSelect: 'none',
    cursor: 'pointer',
  }
);

const $active = style(
  applyVariables({
    'color-bg': tv('select500'),
    shift: '1.25rem',
  })
);

const $switcher = style({
  width: '2.75rem',
  padding: '.25rem',
  borderRadius: '1rem',
  backgroundColor: 'var(--color-bg)',
});

const $handle = style({
  width: '1.5rem',
  height: '1.5rem',
  borderRadius: '50%',
  backgroundColor: tv('base'),
  transition: 'transform 0.1s ease-in-out',
  transform: 'translateX(var(--shift))',
});
