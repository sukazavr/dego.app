import React from 'react';
import { style } from 'typestyle';
import { NestedCSSProperties } from 'typestyle/lib/types';

import { stateTree$ } from '../../generic/states/state-app';
import { useObservable, useObservableFabric } from '../../generic/supply/react-helpers';
import { tv } from '../../generic/supply/style-helpers';
import { isDefined, isNotNull } from '../../generic/supply/type-guards';
import { Divider } from '../layout/Divider';
import { Code } from './Code';
import { useExportResultsWatcher } from './watcher-results';

interface IProps {
  gridArea: string;
}

export const ExportResult = React.memo<IProps>(({ gridArea }) => {
  const isOpen = useObservableFabric(() => stateTree$.view('exportedID').view(isNotNull), []);
  return isOpen ? <Layout gridArea={gridArea} /> : null;
});

const Layout = React.memo<IProps>(({ gridArea }) => {
  const { style$, firstPanel$, secondPanel$, params$ } = useExportResultsWatcher();
  const style = useObservable(style$);
  const { first, second } = useObservable(params$);
  return (
    <div className={$container} style={{ ...style, gridArea }}>
      <div className={$first} style={{ gridColumnEnd: isDefined(second) ? undefined : 3 }}>
        <Code title={first.title} code={first.code} />
      </div>
      {isDefined(second) && (
        <div className={$second}>
          <Code title={second.title} code={second.code} />
        </div>
      )}
      {isDefined(second) && <Divider ward$={firstPanel$} gridArea={SECOND_AREA} />}
      <Divider ward$={secondPanel$} gridArea={THIRD_AREA} />
    </div>
  );
});

const $container = style({
  display: 'grid',
  overflow: 'hidden',
  zIndex: 1,
  backgroundColor: 'rgba(242,242,242,.8)',
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
