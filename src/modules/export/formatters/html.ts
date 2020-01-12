import { EElementType, IElements } from '../../../generic/states/elements';
import {
    addIndent, asHl1, asHl3, asLine, getUniqElementClassName, selectElementWithFallback,
} from './utils';

const DIV = asHl1('div');
const divClose = `&lt;/${DIV}&gt;`;
const createDivLine = (attrName: string, attrValue: string, children: string[]) => {
  const open = `&lt;${DIV} ${attrName}=${asHl3(`&quot;${attrValue}&quot;`)}&gt;`;
  return children.length > 0 ? [open, ...children, divClose] : [`${open}${divClose}`];
};

const makeTree = (
  targetID: string,
  elements: IElements,
  isJSX: boolean,
  hasIndent: boolean = false
): string[] => {
  const target = selectElementWithFallback(targetID, elements);
  const children =
    target.type === EElementType.Component
      ? []
      : target.children.reduce<string[]>(
          (acc, childID) => acc.concat(makeTree(childID, elements, isJSX, true)),
          []
        );
  const attrClass = isJSX ? 'className' : 'class';
  const attrClassName = getUniqElementClassName(targetID, elements);
  const lines = createDivLine(attrClass, attrClassName, children);
  return hasIndent ? lines.map(addIndent) : lines;
};

export const toHTML = (targetID: string, elements: IElements, isJSX: boolean) =>
  makeTree(targetID, elements, isJSX)
    .map(asLine)
    .join('\n');
