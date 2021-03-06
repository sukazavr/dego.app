import React from 'react';
import { style } from 'typestyle';
import { NestedCSSProperties } from 'typestyle/lib/types';

import { stateLayout$ } from '../../generic/states/state-app';
import { useObservable } from '../../generic/supply/react-helpers';
import { ExportResult } from '../export/ExportResult';
import { ExportSettings } from '../export/ExportSettings';
import { Preview } from '../preview/Preview';
import { PreviewHighlighter } from '../preview/PreviewHighlighter';
import { Tree } from '../tree/Tree';
import { AreaSecond } from './AreaSecond';
import { Divider } from './Divider';
import { Footer } from './Footer';
import { useLayoutWatcher } from './watcher';

const FIRST_AREA = '1 / 1 / 2 / 2';
const SECOND_AREA = '1 / 2 / 2 / 3';
const THIRD_AREA = '1 / 3 / 2 / 4';
const EXPORT_RESULT_AREA = '1 / 2 / 2 / 4';

export const Layout = React.memo(() => {
  const style$ = useLayoutWatcher();
  const style = useObservable(style$);
  const { wardTree$, wardNode$ } = React.useMemo(
    () => ({
      wardTree$: stateLayout$.lens('treePanelWidth'),
      wardNode$: stateLayout$.lens('nodePanelWidth'),
    }),
    []
  );
  return (
    <div className={$container} style={style}>
      <div className={$first}>
        <Tree />
        <ExportSettings />
        <Footer />
      </div>
      <div className={$second}>
        <AreaSecond />
      </div>
      <div className={$third}>
        <Preview />
        <PreviewHighlighter />
      </div>
      <Divider ward$={wardTree$} gridArea={SECOND_AREA} zIndex={2} />
      <Divider ward$={wardNode$} gridArea={THIRD_AREA} />
      <ExportResult gridArea={EXPORT_RESULT_AREA} />
    </div>
  );
});

const $container = style({
  flexGrow: 1,
  display: 'grid',
  overflow: 'hidden',
});

const common: NestedCSSProperties = {
  display: 'flex',
  flexDirection: 'column',
};

const $first = style(common, {
  gridArea: FIRST_AREA,
});

const $second = style(common, {
  gridArea: SECOND_AREA,
});

const $third = style(common, {
  gridArea: THIRD_AREA,
});
