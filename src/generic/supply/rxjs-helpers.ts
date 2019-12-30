import {
  defer,
  fromEvent,
  MonoTypeOperatorFunction,
  Observable,
  ObservableInput,
  ObservedValueOf,
  OperatorFunction,
  throwError,
  timer,
} from 'rxjs';
import {
  filter,
  map,
  mapTo,
  mergeMap,
  retryWhen,
  share,
  switchMap,
  take,
  tap,
} from 'rxjs/operators';

import { Atom } from '@grammarly/focal';

import { isDefined } from './type-guards';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const deferIsLoading = <T extends ObservableInput<any> | void>(
  observableFactory: () => T,
  isLoading$?: Atom<boolean>
): Observable<ObservedValueOf<T>> => {
  if (isDefined(isLoading$)) {
    const stop = () => isLoading$.set(false);
    return defer(() => {
      isLoading$.set(true);
      return observableFactory();
    }).pipe(tap(stop, stop, stop));
  } else {
    return defer(observableFactory);
  }
};

// 60 attempts its ~1h and 1m
export const retryStrategy = <T>(maxAttempts = 60) => {
  return retryWhen<T>((attempts) =>
    attempts.pipe(
      mergeMap((error, i) =>
        i < maxAttempts ? timer((i < 7 ? (i + 1) * 2 : 60) * 1000) : throwError(error)
      )
    )
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const debug = <T>(...args: any[]): MonoTypeOperatorFunction<T> => {
  return (source: Observable<T>) => source.pipe(tap(console.log.bind(console, ...args)));
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const selectInTuple = <Tuple extends [any, ...any[]], Index extends number>(
  index: Index
): OperatorFunction<Tuple, Tuple[Index]> => {
  return (source: Observable<Tuple>) => source.pipe(map((value: Tuple) => value[index]));
};

export const continueAfter = <T>(stream: Observable<unknown>): MonoTypeOperatorFunction<T> => {
  return (source) => source.pipe(switchMap((value) => stream.pipe(take(1), mapTo(value))));
};

export const switchCombine = <T1, T2>(stream: Observable<T2>): OperatorFunction<T1, [T1, T2]> => {
  return (source: Observable<T1>) =>
    source.pipe(switchMap((value1) => stream.pipe(map((value2) => [value1, value2] as [T1, T2]))));
};

export const documentClicked$ = fromEvent<MouseEvent>(document, 'click').pipe(share());

export const escPressed$ = fromEvent<KeyboardEvent>(document, 'keydown').pipe(
  filter((e) => e.keyCode === 27),
  share()
);

export const wheel$ = fromEvent<WheelEvent>(window, 'wheel', { passive: false }).pipe(share());
