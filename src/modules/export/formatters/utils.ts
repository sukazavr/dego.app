import { IElements, TElementGenericOrBody } from '../../../generic/states/elements';
import { getElementClassName } from '../../../generic/supply/formaters';
import { isUndefined } from '../../../generic/supply/type-guards';
import { createTreeElement } from '../../tree/utils';

const span = (className: string) => (value: string) => `<span class="${className}">${value}</span>`;

export const asLine = span('line');
export const asHl1 = span('hl1');
export const asHl2 = span('hl2');
export const asHl3 = span('hl3');

export const addIndent = (str: string) => `  ${str}`;

const REG_CAPITAL_LETTER = /[A-Z]/g;
export const classNameKeyToString = (key: string) =>
  key.replace(REG_CAPITAL_LETTER, (match) => `-${match.toLowerCase()}`);

let prevElements: IElements = {};
let classNameCache: Record<string, string> = {};
const uniqClassNames = new Set<string>();
const setUniqClassName = (name: string): string => {
  if (name === '') {
    return setUniqClassName('Noname');
  }
  if (uniqClassNames.has(name)) {
    return setUniqClassName(`${name}-copy`);
  }
  uniqClassNames.add(name);
  return name;
};
export const getUniqElementClassName = (elementID: string, elements: IElements) => {
  if (elements !== prevElements) {
    prevElements = elements;
    classNameCache = {};
    uniqClassNames.clear();
    Object.values(elements).forEach((element) => {
      classNameCache[element.id] = setUniqClassName(getElementClassName(element));
    });
  }
  return classNameCache[elementID];
};

export const selectElementWithFallback = (targetID: string, elements: IElements) => {
  const target = elements[targetID] as TElementGenericOrBody | undefined;
  return isUndefined(target) ? createTreeElement() : target;
};
