import { debounceTime, skip } from 'rxjs/operators';

import { ELEMENTS_SCHEMA_VERSION } from '../../generic/states/elements';
import { stateElements$ } from '../../generic/states/state-app';
import { isNotNull } from '../../generic/supply/type-guards';

const LS_ELEMENTS = '_!ELEMENTS!_';
try {
  const LSElements = localStorage.getItem(LS_ELEMENTS);
  if (isNotNull(LSElements)) {
    const parsed = JSON.parse(LSElements);
    if (ELEMENTS_SCHEMA_VERSION === parsed.v) {
      stateElements$.set(parsed.e);
    }
  }
} catch (error) {}

stateElements$.pipe(skip(1), debounceTime(500)).subscribe((stateElements) => {
  localStorage.setItem(
    LS_ELEMENTS,
    JSON.stringify({ v: ELEMENTS_SCHEMA_VERSION, e: stateElements })
  );
});
