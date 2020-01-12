import { takeUntil } from 'rxjs/operators';

import { actionsExport } from '../../generic/actions';
import { BODY_ID } from '../../generic/states/elements';
import { EExportLayout } from '../../generic/states/export';
import { stateExport$, stateTree$ } from '../../generic/states/state-app';
import { createUseWatcher } from '../../generic/supply/react-helpers';
import { isNotNull } from '../../generic/supply/type-guards';

export const useExportSettingsWatcher = createUseWatcher(({ didUnmount$ }) => {
  const settings$ = stateExport$.lens('settings');
  const exportedID$ = stateTree$.lens('exportedID');

  actionsExport.toggle.$.pipe(takeUntil(didUnmount$)).subscribe(() => {
    exportedID$.modify((_) => (isNotNull(_) ? null : BODY_ID));
  });

  actionsExport.open.$.pipe(takeUntil(didUnmount$)).subscribe(({ exportedID }) => {
    exportedID$.set(exportedID);
  });

  return {
    settings$,
    setLayout: (preset: EExportLayout) => () => settings$.lens('layout').set(preset),
  };
});
