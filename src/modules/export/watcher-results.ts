import { Atom } from '@grammarly/focal';

import { EExportLayout } from '../../generic/states/export';
import { stateElements$, stateExport$, stateTree$ } from '../../generic/states/state-app';
import { createUseWatcher } from '../../generic/supply/react-helpers';
import { isNotNull } from '../../generic/supply/type-guards';
import { toCSS } from './formatters/css';
import { toHTML } from './formatters/html';

export const useExportResultsWatcher = createUseWatcher(() => {
  const params$ = Atom.combine(
    Atom.combine(stateExport$.view('settings'), stateElements$, (settings, elements) => ({
      settings,
      elements,
    })),
    stateTree$.view('exportedID'),
    ({ elements, settings }, exportedID) => {
      const params: {
        first: {
          title: string;
          code: string;
        };
        second?: {
          title: string;
          code: string;
        };
      } = {
        first: {
          title: '',
          code: '',
        },
      };
      if (isNotNull(exportedID)) {
        params.first.title = 'CSS';
        params.first.code = toCSS(exportedID, elements, {
          eliminateEmptyCSSRules: settings.eliminateEmptyCSSRules,
        });
        const isJSX = settings.layout === EExportLayout.JSX;
        params.second = {
          title: isJSX ? 'JSX' : 'HTML',
          code: toHTML(exportedID, elements, isJSX),
        };
      }
      return params;
    }
  );

  const layout$ = stateExport$.lens('layout');

  const style$ = layout$.view(({ firstPanelWidth, secondPanelWidth }) => ({
    gridTemplateColumns: `${firstPanelWidth}px ${secondPanelWidth}px minmax(0, 1fr)`,
    gridTemplateRows: `minmax(0, 1fr)`,
  }));

  return {
    firstPanel$: layout$.lens('firstPanelWidth'),
    secondPanel$: layout$.lens('secondPanelWidth'),
    style$,
    params$,
  };
});
