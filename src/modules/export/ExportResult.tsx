import React from 'react';
import { style } from 'typestyle';
import { NestedCSSProperties } from 'typestyle/lib/types';

import { stateExport$ } from '../../generic/states/state-app';
import { useObservable, useObservableFabric } from '../../generic/supply/react-helpers';
import { tv } from '../../generic/supply/style-helpers';
import { isNull } from '../../generic/supply/type-guards';
import { Divider } from '../layout/Divider';
import { Code } from './Code';
import { useExportResultsWatcher } from './watcher-results';

interface IProps {
  gridArea: string;
}

export const ExportResult = React.memo<IProps>(({ gridArea }) => {
  const targetID = useObservableFabric(() => stateExport$.view('targetID'), []);
  return isNull(targetID) ? null : <Layout gridArea={gridArea} />;
});

const Layout = React.memo<IProps>(({ gridArea }) => {
  const style$ = useExportResultsWatcher();
  const style = useObservable(style$);
  const { firstPanel$, secondPanel$ } = React.useMemo(
    () => ({
      firstPanel$: stateExport$.lens('firstPanelWidth'),
      secondPanel$: stateExport$.lens('secondPanelWidth'),
    }),
    []
  );
  return (
    <div className={$container} style={{ ...style, gridArea }}>
      <div className={$first}>
        <Code title="HTML" code={TEST} />
      </div>
      <div className={$second}>
        <Code title="CSS" code={TEST} />
      </div>
      <div className={$third} />
      <Divider ward$={firstPanel$} gridArea={SECOND_AREA} />
      <Divider ward$={secondPanel$} gridArea={THIRD_AREA} />
    </div>
  );
});

const $container = style({
  display: 'grid',
  overflow: 'hidden',
  zIndex: 1,
});

const FIRST_AREA = '1 / 1 / 2 / 2';
const SECOND_AREA = '1 / 2 / 2 / 3';
const THIRD_AREA = '1 / 3 / 2 / 4';

const common: NestedCSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: tv('base'),
  overflow: 'hidden',
};

const $first = style(common, {
  gridArea: FIRST_AREA,
});

const $second = style(common, {
  gridArea: SECOND_AREA,
});

const $third = style(common, {
  gridArea: THIRD_AREA,
  backgroundColor: tv('base100'),
  opacity: 0.8,
});

const TEST = `<span class="line">.<span class="hl1">container</span> <span class="hl2">{</span></span>
<span class="line">	display: <span class="hl3">grid</span>;</span>
<span class="line">	grid-template-columns: <span class="hl3">1fr 1fr</span>;</span>
<span class="line">	grid-template-rows: <span class="hl3">1fr 1fr</span>;</span>
<span class="line">	grid-gap: <span class="hl3">1em 1em</span>;</span>
<span class="line"><span class="hl2">}</span></span>
`;
