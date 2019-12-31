import { fromEvent, merge } from 'rxjs';
import { auditTime, debounceTime, distinctUntilChanged, map, mapTo, skip } from 'rxjs/operators';

import { isNotNull } from '../supply/type-guards';
import { vwToGraduations } from './shell';
import { stateElements$, stateShell$ } from './state-app';

fromEvent(window, 'resize')
  .pipe(
    auditTime(100),
    map(() => window.innerWidth),
    distinctUntilChanged()
  )
  .subscribe((vw) => stateShell$.modify((s) => ({ ...s, vw, graduations: vwToGraduations(vw) })));

merge(
  fromEvent(window, 'online').pipe(mapTo(true)),
  fromEvent(window, 'offline').pipe(mapTo(false))
)
  .pipe(distinctUntilChanged())
  .subscribe((isOnline) => stateShell$.modify((s) => ({ ...s, isOnline })));

// Elements persistance
const LS_ELEMENTS = '_!ELEMENTS!_';
try {
  const LSElements = localStorage.getItem(LS_ELEMENTS);
  if (isNotNull(LSElements)) {
    stateElements$.set(JSON.parse(LSElements));
  }
} catch (error) {}
stateElements$.pipe(skip(1), debounceTime(500)).subscribe((stateElements) => {
  localStorage.setItem(LS_ELEMENTS, JSON.stringify(stateElements));
});
