import { takeUntil } from 'rxjs/operators';

import { ECanvasType, lensElementCanvas } from '../../../generic/states/elements';
import { stateElements$ } from '../../../generic/states/state-app';
import { ca } from '../../../generic/supply/action-helpers';
import { createUseWatcher } from '../../../generic/supply/react-helpers';

export const useSettingsCanvasWatcher = createUseWatcher(({ didUnmount$ }) => {
  const changeType = ca<ECanvasType>();

  changeType.$.pipe(takeUntil(didUnmount$)).subscribe((type) => {
    stateElements$.lens(lensElementCanvas).modify((_) => ({ ..._, type }));
  });

  return {
    changeType,
  };
});
