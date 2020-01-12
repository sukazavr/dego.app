import {
    CANVAS_ID, ECanvasType, EElementType, IElements, TElementGenericOrBody,
} from '../../../generic/states/elements';
import { getNormalizedElementCSSProperties } from '../../../generic/style-helpers/normalize';
import { isElementGeneric } from '../../../generic/supply/type-guards';
import {
    addIndent, asHl1, asHl2, asHl3, asLine, classNameKeyToString, getUniqElementClassName,
    selectElementWithFallback,
} from './utils';

const createClass = (elementID: string, elements: IElements) => {
  const className = getUniqElementClassName(elementID, elements);
  const element = selectElementWithFallback(elementID, elements);
  const parentType = isElementGeneric(element)
    ? (elements[element.parent] as TElementGenericOrBody).type
    : elements[CANVAS_ID].type === ECanvasType.Div
    ? EElementType.Component
    : EElementType.Flex;
  const rules = getNormalizedElementCSSProperties({
    element,
    parentType,
    excludeComponentStyle: true,
  });
  return [
    `.${asHl1(className)} ${asHl2('{')}`,
    ...Object.entries(rules).map(([name, rule]) =>
      addIndent(`${classNameKeyToString(name)}: ${asHl3(rule)};`)
    ),
    asHl2('}'),
  ];
};

const makeTree = (targetID: string, elements: IElements): string[] => {
  const target = selectElementWithFallback(targetID, elements);
  const lines = createClass(targetID, elements);
  if (target.type !== EElementType.Component) {
    lines.push(
      ...target.children.reduce<string[]>(
        (res, childID) => res.concat('', makeTree(childID, elements)),
        []
      )
    );
  }
  return lines;
};

export const toCSS = (targetID: string, elements: IElements) =>
  makeTree(targetID, elements)
    .map(asLine)
    .join('\n');
