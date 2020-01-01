import { debounceTime, skip, takeUntil } from 'rxjs/operators';

import { stateLayout$ } from '../../generic/states/state-app';
import { createUseWatcher } from '../../generic/supply/react-helpers';
import { isNotNull } from '../../generic/supply/type-guards';

const LS_LAYOUT = '_!LAYOUT!_';

export const useLayoutWatcher = createUseWatcher(({ didUnmount$ }) => {
  try {
    const LSLayout = localStorage.getItem(LS_LAYOUT);
    if (isNotNull(LSLayout)) {
      stateLayout$.set(JSON.parse(LSLayout));
    }
  } catch (error) {}

  stateLayout$.pipe(skip(1), debounceTime(500), takeUntil(didUnmount$)).subscribe((stateLayout) => {
    localStorage.setItem(LS_LAYOUT, JSON.stringify(stateLayout));
  });

  const style$ = stateLayout$.view(({ treePanelWidth, nodePanelWidth }) => ({
    gridTemplateColumns: `${treePanelWidth}px ${nodePanelWidth}px minmax(0, 1fr)`,
    gridTemplateRows: `minmax(0, 1fr)`,
  }));

  return style$;
});
