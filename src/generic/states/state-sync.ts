import '../../modules/tree/state-sync';
import '../../modules/export/state-sync';

import { fromEvent, merge } from 'rxjs';
import { auditTime, distinctUntilChanged, map, mapTo } from 'rxjs/operators';

import { vwToGraduations } from './shell';
import { stateShell$ } from './state-app';

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
