import React from 'react';
import { style } from 'typestyle';

import { ButtonSecondary } from '../../generic/components/ButtonSecondary';
import { Panel } from '../../generic/components/Panel';
import { stateShell$ } from '../../generic/states/state-app';
import { useObservableFabric } from '../../generic/supply/react-helpers';
import { tv } from '../../generic/supply/style-helpers';
import { Update } from './Update';

export const Footer = React.memo(() => {
  const isUpdateAvailable = useObservableFabric(() => stateShell$.view('isUpdateAvailable'), []);
  return (
    <Panel
      title={
        <span className={$appName}>
          Dego&nbsp;
          <span className={$ver}>βeta</span>
          <div id="updates" className={$updates} />
        </span>
      }
    >
      {isUpdateAvailable ? (
        <Update />
      ) : (
        <ButtonSecondary children="Donate" href="https://www.buymeacoffee.com/sukazavr" />
      )}
    </Panel>
  );
});

const $ver = style({
  color: tv('base300'),
});

const $appName = style({
  position: 'relative',
});

const $updates = style({ position: 'absolute', bottom: '-9px', right: '-30px' });
