import { shareReplay, withLatestFrom } from 'rxjs/operators';

import { stateApp$ } from '../states/state-app';
import { generalActionsLog$ } from './action-helpers';
import { isDefined } from './type-guards';

if (process.env.NODE_ENV !== 'production') {
  generalActionsLog$.subscribe(({ key, namespace, payload }) => {
    // tslint:disable:no-console
    console.group('🔷', key, '🔹', namespace);
    console.log(payload);
    console.groupEnd();
  });

  const RDT = window.__REDUX_DEVTOOLS_EXTENSION__;
  if (isDefined(RDT)) {
    const devTools = RDT.connect();
    devTools.init(stateApp$.get());
    stateApp$
      .pipe(withLatestFrom(generalActionsLog$.pipe(shareReplay(1))))
      .subscribe(([state, { key, namespace }]) => {
        devTools.send(`${key}:${namespace}`, state);
      });
  } else {
    stateApp$.subscribe(console.log);
  }
}
