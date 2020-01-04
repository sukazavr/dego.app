import nanoid from 'nanoid';

import {
    BODY_ID, CANVAS_ID, EElementType, getDefaultProps, IElementGeneric, IElements,
} from '../../generic/states/elements';
import { defaultTree } from '../../generic/states/tree';
import {
    isDefined, isElementGeneric, isElementGenericOrBody, isNotNull,
} from '../../generic/supply/type-guards';
import { elStore } from './common';

export const createTreeElement = (): IElementGeneric => ({
  id: nanoid(10),
  name: '',
  parent: BODY_ID,
  children: [],
  type: EElementType.Flex,
  props: getDefaultProps(),
  isExpanded: true,
});

export const mutateAddInside = (draft: IElements, element: IElementGeneric, parentID: string) => {
  parentID = parentID === CANVAS_ID ? BODY_ID : parentID;
  const parent = draft[parentID];
  if (isElementGenericOrBody(parent)) {
    element.parent = parentID;
    const id = element.id;
    parent.children.push(id);
    parent.isExpanded = true;
    draft[id] = element;
  }
};

export const mutateAddNeighbor = (
  draft: IElements,
  element: IElementGeneric,
  neighborID: string,
  below: boolean
) => {
  const neighbor = draft[neighborID];
  if (isElementGeneric(neighbor)) {
    const parentID = neighbor.parent;
    const parent = draft[parentID];
    if (isElementGenericOrBody(parent)) {
      element.parent = parentID;
      const id = element.id;
      const neighborIndex = parent.children.indexOf(neighborID);
      parent.children.splice(neighborIndex + Number(below), 0, id);
      draft[id] = element;
    }
  }
};

export const mutateRemoveFromParent = (draft: IElements, element: IElementGeneric) => {
  const parent = draft[element.parent];
  if (isElementGenericOrBody(parent)) {
    const children = parent.children;
    const index = children.indexOf(element.id);
    if (index > -1) {
      children.splice(index, 1);
    }
  }
};

export const mutateRemoveFromTree = (draft: IElements, element: IElementGeneric) => {
  element.children.forEach((childID) => {
    const child = draft[childID];
    if (isElementGeneric(child)) {
      mutateRemoveFromTree(draft, child);
    }
  });
  delete draft[element.id];
};

export const getPlaceholderStyle = (
  treeEl: HTMLDivElement,
  { rect }: TElMeta,
  { shift }: TElMeta,
  dir: 'top' | 'bottom'
) => {
  if (isNotNull(rect)) {
    const rectTree = treeEl.getBoundingClientRect();
    return {
      top: rect[dir] - rectTree.top + treeEl.scrollTop,
      left: rect.left + shift - rectTree.left,
      width: rect.width - shift,
    };
  } else {
    return { ...defaultTree.highlighter.style };
  }
};

export const getElMeta = (elID: string): TElMeta => {
  const el = elStore.get(elID);
  if (isDefined(el)) {
    const rect = el.getBoundingClientRect();
    const tempEdge = Math.ceil(rect.height * 0.5);
    const tail = tempEdge % 2;
    return {
      heightEdge: (tempEdge - tail) / 2,
      shift: parseFloat(getComputedStyle(el).paddingLeft as string),
      rect,
    };
  } else {
    return { ...defaultElMeta };
  }
};

export type TElMeta = {
  heightEdge: number;
  shift: number;
  rect: ClientRect | null;
};

export const defaultElMeta: TElMeta = {
  heightEdge: 0,
  shift: 0,
  rect: null,
};
