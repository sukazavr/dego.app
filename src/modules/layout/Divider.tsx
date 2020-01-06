import React from 'react';
import { fromEvent } from 'rxjs';
import { map, switchMap, takeUntil, tap, withLatestFrom } from 'rxjs/operators';
import { style } from 'typestyle';

import { Atom } from '@grammarly/focal';

import { createUseWatcher } from '../../generic/supply/react-helpers';
import { continueAfter } from '../../generic/supply/rxjs-helpers';
import { tv } from '../../generic/supply/style-helpers';
import { isNotNull } from '../../generic/supply/type-guards';

const MIN = 100;

interface IProps {
  ward$: Atom<number>;
  gridArea: string;
  zIndex?: number;
}

export const Divider = React.memo<IProps>(({ ward$, gridArea, zIndex }) => {
  const ref = React.useRef<HTMLDivElement>(null);
  useWatcher([ref, ward$]);
  return <div ref={ref} className={$container} style={{ gridArea, zIndex }} />;
});

const useWatcher = createUseWatcher<[React.RefObject<HTMLDivElement>, Atom<number>], void>(
  ({ didMount$, didUnmount$, currentDeps$ }) => {
    const move$ = fromEvent<MouseEvent>(document, 'mousemove');
    const up$ = fromEvent<MouseEvent>(document, 'mouseup');

    currentDeps$
      .pipe(
        continueAfter(didMount$),
        switchMap(([ref, ward$]) => {
          const el = ref.current as HTMLDivElement;
          const parent = el.parentElement as HTMLDivElement;
          return fromEvent<MouseEvent>(el, 'mousedown').pipe(
            withLatestFrom(ward$),
            switchMap(([downE, startedFrom]) => {
              const pos = Math.floor(el.offsetWidth / 2) - downE.offsetX + downE.pageX;
              const parentRect = parent.getBoundingClientRect();
              const max = parentRect.width - MIN;
              const initialVal = startedFrom > max ? max : startedFrom;
              return move$.pipe(
                map((moveE) => {
                  moveE.preventDefault();
                  const val = initialVal + moveE.pageX - pos;
                  return val >= MIN && val <= max ? val : null;
                }),
                takeUntil(up$)
              );
            }),
            tap((val) => {
              if (isNotNull(val)) {
                ward$.set(val);
              }
            })
          );
        }),
        takeUntil(didUnmount$)
      )
      .subscribe();
  }
);

const $container = style({
  width: '1px',
  marginLeft: '-4px',
  padding: '0 4px',
  backgroundClip: 'content-box',
  backgroundColor: tv('base900'),
  cursor: 'col-resize',
  zIndex: 1,
});
