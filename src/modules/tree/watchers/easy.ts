import produce from 'immer';
import { merge, timer } from 'rxjs';
import { debounceTime, delay, filter, map, skip, switchMap, takeUntil, tap } from 'rxjs/operators';

import { actionsTree } from '../../../generic/actions';
import { stateApp$, stateElements$, stateTree$ } from '../../../generic/states/state-app';
import { defaultTree, ITree } from '../../../generic/states/tree';
import { createUseWatcher } from '../../../generic/supply/react-helpers';
import {
    isDefined, isElementGeneric, isNotNull, isPresent,
} from '../../../generic/supply/type-guards';
import { elStore } from '../common';
import { FLASH_DURATION } from '../Element/Element';
import {
    createTreeElement, mutateAddInside, mutateAddNeighbor, mutateRemoveFromParent,
    mutateRemoveFromTree,
} from '../utils';

const LS_TREE = '_!TREE!_';

export const useTreeEasyWatcher = createUseWatcher(({ didUnmount$ }) => {
  try {
    const LSTree = localStorage.getItem(LS_TREE);
    if (isNotNull(LSTree)) {
      const nextTree = { ...defaultTree };
      const { focusedID }: Partial<ITree> = JSON.parse(LSTree);
      if (isPresent(focusedID) && stateElements$.get()[focusedID]) {
        nextTree.focusedID = focusedID;
      }
      stateTree$.set(nextTree);
    }
  } catch (error) {}

  stateTree$.pipe(skip(1), debounceTime(500), takeUntil(didUnmount$)).subscribe(({ focusedID }) => {
    const persistentTree: Partial<ITree> = {
      focusedID,
    };
    localStorage.setItem(LS_TREE, JSON.stringify(persistentTree));
  });

  merge(
    actionsTree.addInside.$.pipe(
      tap(({ parentID }) => {
        const element = createTreeElement();
        stateApp$.modify((stateApp) => ({
          ...stateApp,
          elements: produce(stateApp.elements, (draft) => {
            mutateAddInside(draft, element, parentID);
          }),
          tree: {
            ...stateApp.tree,
            flashedID: element.id,
          },
        }));
      })
    ),
    merge<[string, boolean], [string, boolean]>(
      actionsTree.addAbove.$.pipe(map(({ neighborID }) => [neighborID, false])),
      actionsTree.addBelow.$.pipe(map(({ neighborID }) => [neighborID, true]))
    ).pipe(
      tap(([neighborID, after]) => {
        const element = createTreeElement();
        stateApp$.modify((stateApp) => ({
          ...stateApp,
          elements: produce(stateApp.elements, (draft) => {
            mutateAddNeighbor(draft, element, neighborID, after);
          }),
          tree: {
            ...stateApp.tree,
            flashedID: element.id,
          },
        }));
      })
    ),
    actionsTree.delete.$.pipe(
      tap(({ id }) => {
        stateApp$.modify((state) =>
          produce(state, (draft) => {
            if (id === draft.tree.focusedID) {
              draft.tree.focusedID = null;
            }
            const elements = draft.elements;
            const element = elements[id];
            if (isElementGeneric(element)) {
              mutateRemoveFromParent(elements, element);
              mutateRemoveFromTree(elements, element);
            }
          })
        );
      })
    ),
    actionsTree.focus.$.pipe(
      tap(({ id }) => {
        const el = elStore.get(id);
        if (isDefined(el)) {
          stateTree$.lens('focusedID').set(id);
          const treeEl = el.parentElement?.parentElement as HTMLElement;
          const parentScrollTop = treeEl.scrollTop;
          const offsetDiff = el.offsetTop;
          const overTop = offsetDiff < parentScrollTop;
          const overBottom = offsetDiff + el.clientHeight > parentScrollTop + treeEl.clientHeight;
          if (overTop || overBottom) {
            el.scrollIntoView();
          }
        }
      })
    ),
    stateTree$.view('flashedID').pipe(
      filter<string | null, string>(isNotNull),
      switchMap((id) =>
        timer(100).pipe(
          tap(actionsTree.focus._({ id })),
          delay(FLASH_DURATION),
          tap(() => {
            stateTree$.lens('flashedID').set(null);
          })
        )
      )
    )
  )
    .pipe(takeUntil(didUnmount$))
    .subscribe();
});
