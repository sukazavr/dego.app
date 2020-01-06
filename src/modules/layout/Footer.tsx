import React from 'react';
import { style } from 'typestyle';

import { ButtonSecondary } from '../../generic/components/ButtonSecondary';
import { Panel } from '../../generic/components/Panel';
import { tv } from '../../generic/supply/style-helpers';

export const Footer = React.memo(() => {
  return (
    <Panel
      title={
        <>
          Dego&nbsp;
          <span className={$ver}>βeta</span>
        </>
      }
    >
      <ButtonSecondary children="Donate" href="https://www.buymeacoffee.com/sukazavr" />
    </Panel>
  );
});

const $ver = style({
  color: tv('base300'),
});
