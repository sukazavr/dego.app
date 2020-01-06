

import { stateExport$ } from '../../generic/states/state-app';
import { createUseWatcher } from '../../generic/supply/react-helpers';

export const useExportResultsWatcher = createUseWatcher(() => {
  const style$ = stateExport$.view(({ firstPanelWidth, secondPanelWidth }) => ({
    gridTemplateColumns: `${firstPanelWidth}px ${secondPanelWidth}px minmax(0, 1fr)`,
    gridTemplateRows: `minmax(0, 1fr)`,
  }));

  return style$;
});
