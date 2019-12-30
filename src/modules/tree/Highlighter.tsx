import React from 'react';
import { style } from 'typestyle';

import { stateTree$ } from '../../generic/states/state-app';
import { useObservableFabric } from '../../generic/supply/react-helpers';
import { tv } from '../../generic/supply/style-helpers';

export const PLACEHOLDER_HEIGHT = 4;

export const Highlighter = React.memo(() => {
  const { isVisible, style } = useObservableFabric(() => stateTree$.lens('highlighter'), []);
  if (isVisible) {
    return (
      <div
        className={$placeholder}
        style={{
          ...style,
          top: style.top - PLACEHOLDER_HEIGHT / 2,
        }}
      />
    );
  }
  return null;
});

const $placeholder = style({
  height: PLACEHOLDER_HEIGHT,
  background: tv('select500'),
  position: 'absolute',
  pointerEvents: 'none',
  transitionDuration: '60ms',
  transitionProperty: 'top',
});
