import { createElement, memo, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import {
  concatAll,
  distinctUntilChanged,
  map,
  pairwise,
  shareReplay,
  skip,
  startWith,
  takeUntil,
} from 'rxjs/operators';

import { Atom, ReadOnlyAtom } from '@grammarly/focal';

import { ca } from './action-helpers';
import { isAnyAtom, isDefined, isFunction, isNull, isPresent, isUndefined } from './type-guards';

export const setRef = <T>(
  ref: React.RefObject<T> | ((instance: T | null) => void) | null | undefined,
  value: T | null
): void => {
  if (isFunction(ref)) {
    ref(value);
  } else if (isPresent(ref)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (ref as any).current = value;
  }
};

export const useForkRef = <T>(
  refA: React.Ref<T> | null,
  refB: React.Ref<T> | null
): React.Ref<T> => {
  return useMemo(() => {
    if (isNull(refA) && isNull(refB)) {
      return null;
    }
    return (refValue) => {
      setRef(refA, refValue);
      setRef(refB, refValue);
    };
  }, [refA, refB]);
};

export const useEnhancedEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export function createUseWatcher<
  TCreate extends (context: {
    didMount$: Observable<void>;
    didUnmount$: Observable<void>;
    deps$: Observable<{ previous: undefined; current: undefined }>;
    currentDeps$: Observable<undefined>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }) => any
>(create: TCreate): () => ReturnType<TCreate>;
export function createUseWatcher<TDeps extends unknown[], TReturn>(
  create: (context: {
    didMount$: Observable<void>;
    didUnmount$: Observable<void>;
    deps$: Observable<{ previous?: TDeps; current: TDeps }>;
    currentDeps$: Observable<TDeps>;
  }) => TReturn
): (deps: TDeps) => TReturn;
export function createUseWatcher<TDeps extends unknown[], TReturn>(
  create: (context: {
    didMount$: Observable<void>;
    didUnmount$: Observable<void>;
    deps$: Observable<{ previous?: TDeps; current: TDeps }>;
    currentDeps$: Observable<TDeps | undefined>;
  }) => TReturn
): (deps?: TDeps) => TReturn {
  return (deps) => {
    const [initialize, terminate, updateDependencies, result] = useMemo(() => {
      const didMount = ca<void>();
      const didUnmount$ = new Subject<void>();
      const didUnmount = () => {
        didUnmount$.next();
        didUnmount$.complete();
      };
      const updateDeps = ca<TDeps | undefined>();
      const didMount$ = didMount.$.pipe(
        shareReplay({
          bufferSize: 1,
          refCount: true,
        }),
        takeUntil(didUnmount$)
      );
      const currentDeps$ = updateDeps.$.pipe(
        shareReplay({
          bufferSize: 1,
          refCount: true,
        }),
        takeUntil(didUnmount$)
      );
      const deps$ = updateDeps.$.pipe(
        startWith(undefined),
        pairwise(),
        map(
          ([previous, current]) => ({ previous, current } as { previous?: TDeps; current: TDeps })
        ),
        shareReplay({
          bufferSize: 1,
          refCount: true,
        }),
        takeUntil(didUnmount$)
      );
      const res = create({
        didMount$,
        didUnmount$,
        deps$,
        currentDeps$,
      });
      // Init
      didMount$.subscribe();
      deps$.subscribe();
      currentDeps$.subscribe();
      return [didMount, didUnmount, updateDeps, res];
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useMemo(
      () => {
        updateDependencies(deps);
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      isDefined(deps) ? deps : []
    );
    useEnhancedEffect(() => {
      initialize();
      return terminate;
    }, []);
    return result;
  };
}

export function useObservable<T>($: BehaviorSubject<T> | Atom<T> | ReadOnlyAtom<T>): T;
export function useObservable<T>($: Observable<T>): T | null;
export function useObservable<T>($: Observable<T>, defaultValue: T): T;
export function useObservable<T>($: Observable<T>, defaultValue?: T) {
  let initialValue: T | null;
  // The conditions order matters
  if (isAnyAtom<T>($)) {
    initialValue = $.get();
  } else if ($ instanceof BehaviorSubject) {
    initialValue = $.getValue();
  } else {
    initialValue = isUndefined(defaultValue) ? null : defaultValue;
  }
  const [value, setValue] = useState(initialValue);
  useEnhancedEffect(() => {
    const stream$ = isAnyAtom<T>($)
      ? $.pipe(skip(1)) // Don't set distinct coz atom already has it
      : $ instanceof BehaviorSubject
      ? $.pipe(skip(1), distinctUntilChanged())
      : $.pipe(distinctUntilChanged());
    const sub = stream$.subscribe((nextValue) => {
      setValue(() => nextValue); // Use callback to safely transfer fn in stream
    });
    return () => sub.unsubscribe();
  }, [$]);
  return value;
}

export function useObservableFabric<T>(
  fb: () => BehaviorSubject<T> | Atom<T> | ReadOnlyAtom<T>,
  deps: unknown[]
): T;
export function useObservableFabric<T>(fb: () => Observable<T>, deps: unknown[]): T | null;
export function useObservableFabric<T>(
  fb: () => Observable<T>,
  deps: unknown[],
  defaultValue: T
): T;
export function useObservableFabric<T>(fb: () => Observable<T>, deps: unknown[], defaultValue?: T) {
  const $ = useMemo(fb, deps);
  return useObservable($, defaultValue);
}

export const createSharedProvider = (component: React.FC) => {
  const attach = ca<BehaviorSubject<[number, React.FC]>>();
  const dock$ = attach.$.pipe(concatAll(), shareReplay(1));
  let sourceID = 0;
  return memo(() => {
    const ID = useMemo(() => sourceID++, []);
    const el = useObservableFabric(
      () =>
        dock$.pipe(
          map(([nextID, nextComponent]) => (nextID === ID ? createElement(nextComponent) : null))
        ),
      []
    );
    useEnhancedEffect(() => {
      const train = new BehaviorSubject<[number, React.FC]>([ID, component]);
      attach(train);
      return () => train.complete();
    }, []);
    return el;
  });
};
