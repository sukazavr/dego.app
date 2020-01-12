import produce from 'immer';
import nanoid from 'nanoid';
import { merge, timer } from 'rxjs';
import { debounceTime, delay, filter, map, skip, switchMap, takeUntil, tap } from 'rxjs/operators';

import { actionsTree } from '../../../generic/actions';
import {
    IElementGeneric, IElements, TElementGenericOrBody,
} from '../../../generic/states/elements';
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
      const { focusedID, exportedID }: Partial<ITree> = JSON.parse(LSTree);
      const elements = stateElements$.get();
      if (isPresent(focusedID) && elements[focusedID]) {
        nextTree.focusedID = focusedID;
      }
      if (isPresent(exportedID) && elements[exportedID]) {
        nextTree.exportedID = exportedID;
      }
      stateTree$.set(nextTree);
    }
  } catch (error) {}

  stateTree$
    .pipe(skip(1), debounceTime(500), takeUntil(didUnmount$))
    .subscribe(({ focusedID, exportedID }) => {
      const persistentTree: Partial<ITree> = {
        focusedID,
        exportedID,
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
    actionsTree.duplicate.$.pipe(
      tap(({ id }) => {
        stateApp$.modify((state) => {
          const elements = state.elements;
          const donor = elements[id];
          if (isElementGeneric(donor)) {
            const newElements: IElements = {};
            const parent = elements[donor.parent] as TElementGenericOrBody;
            const newElementID = duplicateElement(elements, newElements, donor, parent.id);
            return {
              ...state,
              elements: {
                ...elements,
                ...newElements,
                [parent.id]: { ...parent, children: parent.children.concat(newElementID) },
              },
              tree: {
                ...state.tree,
                flashedID: newElementID,
              },
            };
          }
          return state;
        });
      })
    ),
    actionsTree.delete.$.pipe(
      tap(({ id }) => {
        stateApp$.modify((state) =>
          produce(state, (draft) => {
            const elements = draft.elements;
            const element = elements[id];
            if (isElementGeneric(element)) {
              mutateRemoveFromParent(elements, element);
              mutateRemoveFromTree(draft, element);
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

const duplicateElement = (
  source: IElements,
  sink: IElements,
  donor: IElementGeneric,
  parentID: string
) => {
  const recipient: IElementGeneric = JSON.parse(JSON.stringify(donor));
  const id = nanoid(10);
  recipient.id = id;
  recipient.parent = parentID;
  recipient.children = recipient.children.map((childID) => {
    const child = source[childID] as IElementGeneric;
    return duplicateElement(source, sink, child, id);
  });
  sink[id] = recipient;
  return id;
};
