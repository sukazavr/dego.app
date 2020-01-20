import { NestedCSSProperties } from 'typestyle/lib/types';

import {
    CANVAS_ID, ECanvasType, EElementType, IElements, TElementGenericOrBody,
} from '../../../generic/states/elements';
import { getNormalizedElementCSSProperties } from '../../../generic/style-helpers/normalize';
import { isDefined, isElementGeneric } from '../../../generic/supply/type-guards';
import {
    addIndent, asHl1, asHl2, asHl3, asLine, classNameKeyToString, getUniqElementClassName,
    selectElementWithFallback,
} from './utils';

const createClass = (className: string, rules: NestedCSSProperties) => [
  `.${asHl1(className)} ${asHl2('{')}`,
  ...Object.entries(rules).map(([name, rule]) =>
    addIndent(`${classNameKeyToString(name)}: ${asHl3(rule)};`)
  ),
  asHl2('}'),
];

const targetToLines = (elementID: string, elements: IElements) => {
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
    excludeMockupStyle: true,
  });
  const $nest = rules.$nest;
  delete rules.$nest;
  const lines = [
    `.${asHl1(className)} ${asHl2('{')}`,
    ...Object.entries(rules).map(([name, rule]) =>
      addIndent(`${classNameKeyToString(name)}: ${asHl3(rule)};`)
    ),
    asHl2('}'),
  ];
  if (isDefined($nest)) {
    Object.entries($nest).forEach(([subClassName, subRules]) => {
      lines.push('');
      lines.push(
        ...createClass(subClassName.replace('&', className), subRules as NestedCSSProperties)
      );
    });
  }
  return lines;
};

const makeTree = (targetID: string, elements: IElements): string[] => {
  const target = selectElementWithFallback(targetID, elements);
  const lines = targetToLines(targetID, elements);
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
