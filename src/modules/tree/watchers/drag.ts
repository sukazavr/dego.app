import produce from 'immer';
import {
    distinct, distinctUntilChanged, map, switchMap, takeUntil, tap, withLatestFrom,
} from 'rxjs/operators';

import { ReadOnlyAtom } from '@grammarly/focal';

import { BODY_ID, CANVAS_ID } from '../../../generic/states/elements';
import { stateApp$, stateElements$, stateTree$ } from '../../../generic/states/state-app';
import { defaultTree, ITree } from '../../../generic/states/tree';
import { createUseWatcher } from '../../../generic/supply/react-helpers';
import { continueAfter, selectInTuple } from '../../../generic/supply/rxjs-helpers';
import {
    isArray, isDefined, isNotElementCanvas, isNotNull, isTreeElement,
} from '../../../generic/supply/type-guards';
import { isArrayEqual } from '../../../generic/supply/utils';
import {
    treeElementEndDragging, treeElementOnDrag, treeElementSetTarget, treeElementStartDragging,
} from '../common';
import {
    getElMeta, getPlaceholderStyle, mutateAddInside, mutateAddNeighbor, mutateRemoveFromParent,
} from '../utils';

interface ITreeContext {
  treeIndex: string[];
  treePaths: Record<string, string[]>;
  treeMaxDeep: Record<string, string>;
}

export const useTreeDragWatcher = createUseWatcher<
  [React.RefObject<HTMLDivElement>],
  { tree$: ReadOnlyAtom<ITreeContext> }
>(({ currentDeps$, didMount$, didUnmount$ }) => {
  let prevPaths: Record<string, string[]> = {};
  const tree$ = stateElements$.view<ITreeContext>((elements) => {
    const nextPaths: { [id: string]: string[] } = {};
    const nextIndex: string[] = [];
    const nextMaxDeep: { [id: string]: string } = {};
    const grab = (id: string, parentPath: string[], putIndex: boolean) => {
      const prevPath = prevPaths[id];
      const nextPath = [...parentPath, id];
      const path = isArray(prevPath) && isArrayEqual(prevPath, nextPath) ? prevPath : nextPath;
      if (putIndex) {
        nextPaths[id] = path;
        nextIndex.push(id);
      }
      const element = elements[id];
      if (isNotElementCanvas(element)) {
        const isExpanded = element.isExpanded;
        element.children.forEach((childID) => grab(childID, path, putIndex && isExpanded));
      }
    };
    grab(CANVAS_ID, [], true);
    grab(BODY_ID, [], true);
    nextIndex.forEach((elementID) => {
      const path = nextPaths[elementID];
      const maxDeep = path[path.length - 1];
      path.forEach((id) => {
        nextMaxDeep[id] = maxDeep;
      });
    });
    prevPaths = nextPaths;
    return {
      treeIndex: nextIndex,
      treePaths: nextPaths,
      treeMaxDeep: nextMaxDeep,
    };
  });

  const draggingID$ = stateTree$.lens('draggingID');

  currentDeps$
    .pipe(
      selectInTuple(0),
      distinctUntilChanged(),
      continueAfter(didMount$),
      switchMap((ref) => {
        const treeEl = ref.current as HTMLDivElement;
        return treeElementStartDragging.$.pipe(
          tap((draggingID) => draggingID$.set(draggingID)),
          withLatestFrom(tree$),
          switchMap(([draggingID, { treeIndex, treePaths, treeMaxDeep }]) =>
            treeElementSetTarget.$.pipe(
              distinctUntilChanged(),
              switchMap((targetID) => {
                const canDrop = !treePaths[targetID].includes(draggingID);
                const targetMeta = getElMeta(targetID);
                const landingZone =
                  targetID === CANVAS_ID || targetID === BODY_ID
                    ? treeEl.getBoundingClientRect()
                    : targetMeta.rect;
                return treeElementOnDrag.$.pipe(
                  distinct(({ pageX, pageY }) => `${pageX}:${pageY}`),
                  map((onDragEvent) => {
                    const s: ITree = {
                      ...defaultTree,
                      draggingID,
                      targetID,
                      add: { ...defaultTree.add },
                      highlighter: { ...defaultTree.highlighter },
                    };
                    if (canDrop && landingZone) {
                      const { pageX: x, pageY: y } = onDragEvent;
                      const { top, left, bottom, right } = landingZone;
                      if (
                        // "Math.ceil(top) - 1 <= y" for skip 1px gap between elements
                        (top <= y || Math.ceil(top) - 1 <= y) &&
                        y <= bottom &&
                        left <= x &&
                        x <= right
                      ) {
                        s.highlighter.isVisible = canDrop;
                        const dndTargetPath = treePaths[targetID];
                        const dndTargetParent = dndTargetPath[dndTargetPath.length - 2];
                        if (isDefined(dndTargetParent)) {
                          const heightEdge = targetMeta.heightEdge;
                          if (y > bottom - heightEdge) {
                            s.add.below = true;
                            s.parentID = dndTargetParent;
                            const maxDeep = treeMaxDeep[targetID];
                            const srcMeta = maxDeep === targetID ? targetMeta : getElMeta(maxDeep);
                            const fromMeta = getElMeta(dndTargetParent);
                            s.highlighter.style = getPlaceholderStyle(
                              treeEl,
                              srcMeta,
                              fromMeta,
                              'bottom'
                            );
                          } else if (y < top + heightEdge) {
                            s.add.above = true;
                            s.parentID = dndTargetParent;
                            s.highlighter.style = getPlaceholderStyle(
                              treeEl,
                              targetMeta,
                              getElMeta(dndTargetParent),
                              'top'
                            );
                          } else {
                            s.add.inside = true;
                            s.parentID = targetID;
                            const maxDeep = treeMaxDeep[targetID];
                            const srcMeta = maxDeep === targetID ? targetMeta : getElMeta(maxDeep);
                            s.highlighter.style = getPlaceholderStyle(
                              treeEl,
                              srcMeta,
                              targetMeta,
                              'bottom'
                            );
                          }
                        } else {
                          s.add.inside = true;
                          s.parentID = targetID;
                          s.highlighter.style = getPlaceholderStyle(
                            treeEl,
                            getElMeta(treeIndex[treeIndex.length - 1]),
                            targetMeta,
                            'bottom'
                          );
                        }
                      }
                    }
                    return s;
                  })
                );
              })
            )
          )
        );
      }),
      takeUntil(didUnmount$)
    )
    .subscribe((stateTree) => {
      stateTree$.set(stateTree);
    });

  treeElementEndDragging.$.pipe(takeUntil(didUnmount$)).subscribe(() => {
    stateApp$.modify((stateApp) => {
      const { draggingID, targetID, add } = stateApp.tree;
      return {
        ...stateApp,
        tree: {
          ...defaultTree,
          flashedID: draggingID,
        },
        elements: produce(stateApp.elements, (draft) => {
          if (isNotNull(draggingID) && isNotNull(targetID)) {
            const element = draft[draggingID];
            if (isTreeElement(element)) {
              if (add.above) {
                mutateRemoveFromParent(draft, element);
                mutateAddNeighbor(draft, element, targetID, false);
              } else if (add.below) {
                mutateRemoveFromParent(draft, element);
                mutateAddNeighbor(draft, element, targetID, true);
              } else if (add.inside) {
                mutateRemoveFromParent(draft, element);
                mutateAddInside(draft, element, targetID);
              }
            }
          }
        }),
      };
    });
  });

  return {
    tree$,
  };
});
