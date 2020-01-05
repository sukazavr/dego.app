import React from 'react';
import { fromEvent } from 'rxjs';
import { distinctUntilChanged, switchMap, takeUntil, tap } from 'rxjs/operators';

import { ReadOnlyAtom } from '@grammarly/focal';

import { ECanvasType, lensElementCanvas } from '../../generic/states/elements';
import { stateElements$ } from '../../generic/states/state-app';
import { createUseWatcher } from '../../generic/supply/react-helpers';
import { continueAfter, selectInTuple } from '../../generic/supply/rxjs-helpers';

export const usePreviewWatcher = createUseWatcher<
  [React.RefObject<HTMLDivElement>],
  ReadOnlyAtom<React.CSSProperties>
>(({ currentDeps$, didMount$, didUnmount$ }) => {
  const move$ = fromEvent<MouseEvent>(document, 'mousemove');
  const up$ = fromEvent<MouseEvent>(document, 'mouseup');

  const canvasStyle$ = stateElements$.view(lensElementCanvas).view((_) => {
    const style: React.CSSProperties = {
      height: _.height.n,
      width: _.width.n,
    };
    if (!_.isTransparent) {
      style.backgroundImage = 'none';
    }
    if (_.type !== ECanvasType.Div) {
      style.display = 'flex';
      if (_.type === ECanvasType.FlexColumn) {
        style.flexDirection = 'column';
      }
    }
    return style;
  });

  currentDeps$
    .pipe(
      selectInTuple(0),
      distinctUntilChanged(),
      continueAfter(didMount$),
      switchMap((ref) => {
        const el = ref.current as HTMLDivElement;
        return fromEvent<MouseEvent>(el, 'mousedown').pipe(
          switchMap((downE) => {
            const maxX = el.scrollWidth;
            const maxY = el.scrollHeight;
            const initialLeft = el.scrollLeft;
            const initialTop = el.scrollTop;
            const initialX = downE.pageX;
            const initialY = downE.pageY;
            return move$.pipe(
              tap((moveE) => {
                moveE.preventDefault();
                const nextX = initialLeft + initialX - moveE.pageX;
                const nextY = initialTop + initialY - moveE.pageY;
                el.scrollLeft = nextX < 0 ? 0 : nextX > maxX ? maxX : nextX;
                el.scrollTop = nextY < 0 ? 0 : nextY > maxY ? maxY : nextY;
              }),
              takeUntil(up$)
            );
          })
        );
      }),
      takeUntil(didUnmount$)
    )
    .subscribe();

  return canvasStyle$;
});
