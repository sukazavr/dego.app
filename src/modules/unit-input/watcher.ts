import React from 'react';
import { combineLatest, concat, merge, NEVER, of } from 'rxjs';
import {
    distinctUntilChanged, filter, map, shareReplay, switchAll, switchMap, switchMapTo, takeUntil,
    tap, withLatestFrom,
} from 'rxjs/operators';

import { Atom } from '@grammarly/focal';

import { IUnit } from '../../generic/states/unit';
import { ca, TAction } from '../../generic/supply/action-helpers';
import { createUseWatcher } from '../../generic/supply/react-helpers';
import {
    continueAfter, selectInTuple, switchCombine, wheel$,
} from '../../generic/supply/rxjs-helpers';
import { isDefined, isText } from '../../generic/supply/type-guards';
import { isArrayEqual } from '../../generic/supply/utils';
import { canIncrement, TUnitOptionsKeys, unitOptions, unitToString } from './options';
import { getMultiplier } from './utils';

export const useUnitInputWatcher = createUseWatcher<
  [React.RefObject<HTMLInputElement>, Atom<IUnit>, TUnitOptionsKeys[]],
  {
    state$: Atom<{
      value: string;
      placeholder: string;
      isInvalid: boolean;
    }>;
    actions: {
      onChange: TAction<React.ChangeEvent<HTMLInputElement>>;
      onFocus: TAction<React.FocusEvent<HTMLInputElement>>;
      onBlur: TAction<React.FocusEvent<HTMLInputElement>>;
      onMouseEnter: TAction<React.MouseEvent<HTMLInputElement, MouseEvent>>;
      onMouseLeave: TAction<React.MouseEvent<HTMLInputElement, MouseEvent>>;
      onKeyDown: TAction<React.KeyboardEvent<HTMLInputElement>>;
    };
  }
>(({ currentDeps$, didUnmount$, didMount$ }) => {
  const state$ = Atom.create({
    value: '',
    placeholder: '',
    isInvalid: false,
  });

  const onChange = ca<React.ChangeEvent<HTMLInputElement>>();
  const onFocus = ca<React.FocusEvent<HTMLInputElement>>();
  const onBlur = ca<React.FocusEvent<HTMLInputElement>>();
  const onMouseEnter = ca<React.MouseEvent<HTMLInputElement, MouseEvent>>();
  const onMouseLeave = ca<React.MouseEvent<HTMLInputElement, MouseEvent>>();
  const onKeyDown = ca<React.KeyboardEvent<HTMLInputElement>>();

  const el$ = currentDeps$.pipe(
    selectInTuple(0),
    distinctUntilChanged(),
    continueAfter(didMount$),
    map((ref) => ref.current as HTMLInputElement),
    shareReplay(1)
  );

  const unitAtom$ = currentDeps$.pipe(selectInTuple(1), distinctUntilChanged(), shareReplay(1));
  const unit$ = unitAtom$.pipe(switchAll());

  const unitOptionsScope$ = currentDeps$.pipe(
    selectInTuple(2),
    distinctUntilChanged(isArrayEqual),
    map((options) => options.map((option) => unitOptions[option])),
    shareReplay(1)
  );

  const potentialOption$ = combineLatest(unit$, unitOptionsScope$).pipe(
    map(([unit, unitOptionsScope]) => {
      const potentialOption = unitOptionsScope.find((option) => option.is(unit));
      return isDefined(potentialOption) ? potentialOption : unitOptions.default;
    }),
    distinctUntilChanged(),
    shareReplay(1)
  );

  // Follow the source
  potentialOption$
    .pipe(switchCombine(unit$), takeUntil(didUnmount$))
    .subscribe(([potentialOption, unit]) => {
      state$.set({
        value: potentialOption.unitToString(unit),
        placeholder: potentialOption.placeholder,
        isInvalid: false,
      });
    });

  // Reaction on input change
  onChange.$.pipe(
    withLatestFrom(potentialOption$, unitOptionsScope$, unitAtom$),
    takeUntil(didUnmount$)
  ).subscribe(([e, potentialOption, unitOptionsScope, unitAtom]) => {
    const nextValue = e.target.value;
    if (isText(nextValue.trim())) {
      const unit = potentialOption.stringToUnit(nextValue);
      const isValid = unitOptionsScope.some((option) => option.is(unit));
      if (isValid) {
        unitAtom.set(unit);
      }
      state$.set({
        value: nextValue,
        placeholder: potentialOption.placeholder,
        isInvalid: !isValid,
      });
    } else {
      unitAtom.set(unitOptionsScope[0].defaultUnit);
      state$.set({
        value: nextValue,
        placeholder: potentialOption.placeholder,
        isInvalid: false,
      });
    }
  });

  onBlur.$.pipe(switchMapTo(unitAtom$), takeUntil(didUnmount$)).subscribe((unitAtom) => {
    state$.modify((state) => {
      if (state.isInvalid) {
        return state;
      } else {
        return { ...state, value: unitToString(unitAtom.get()) };
      }
    });
  });

  // Increment by keyboard arrows and mouse wheel
  unit$
    .pipe(
      map(canIncrement),
      distinctUntilChanged(),
      switchMap((canIncrement) =>
        canIncrement
          ? combineLatest(el$, unitAtom$).pipe(
              switchCombine(
                merge(
                  // mouse wheel
                  onFocus.$.pipe(
                    switchMap(() =>
                      concat(of(0), onMouseEnter.$).pipe(
                        switchMap(() =>
                          wheel$.pipe(
                            tap((e) => {
                              e.preventDefault(); // Prevent zoom-in/out & scroll
                            }),
                            takeUntil(onMouseLeave.$)
                          )
                        ),
                        takeUntil(onBlur.$)
                      )
                    ),
                    withLatestFrom(unit$),
                    map(([e, unit]) => (e.deltaY < 0 ? 1 : -1) * getMultiplier(unit, e))
                  ),
                  // keyboard arrows
                  onKeyDown.$.pipe(
                    filter(({ keyCode: c }) => c === 38 || c === 40),
                    withLatestFrom(unit$),
                    map(([e, unit]) => (e.keyCode === 38 ? 1 : -1) * getMultiplier(unit, e))
                  )
                )
              )
            )
          : NEVER
      ),
      takeUntil(didUnmount$)
    )
    .subscribe(([[el, unitAtom], inc]) => {
      unitAtom.modify((unit) => {
        const n = parseFloat((unit.n + inc).toFixed(2));
        return { ...unit, n };
      });
      window.requestAnimationFrame(() => {
        el.select();
      });
    });

  // Select all on focus
  onFocus.$.pipe(takeUntil(didUnmount$)).subscribe((e) => {
    e.target.select();
  });

  // Prevent focus out
  onKeyDown.$.pipe(takeUntil(didUnmount$)).subscribe((e) => {
    if (e.altKey) {
      e.preventDefault();
    }
  });

  return {
    state$,
    actions: {
      onChange,
      onFocus,
      onBlur,
      onMouseEnter,
      onMouseLeave,
      onKeyDown,
    },
  };
});
