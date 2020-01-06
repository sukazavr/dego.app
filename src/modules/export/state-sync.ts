import { debounceTime, skip } from 'rxjs/operators';

import { stateExport$ } from '../../generic/states/state-app';
import { isNotNull } from '../../generic/supply/type-guards';

const LS_EXPORT = '_!EXPORT!_';

try {
  const LSExport = localStorage.getItem(LS_EXPORT);
  if (isNotNull(LSExport)) {
    stateExport$.set(JSON.parse(LSExport));
  }
} catch (error) {}

stateExport$.pipe(skip(1), debounceTime(500)).subscribe((stateExport) => {
  localStorage.setItem(LS_EXPORT, JSON.stringify(stateExport));
});
