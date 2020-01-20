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

const targetToLines = (elementID: string, elements: IElements, options: IFormatterCSSOptions) => {
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
  const entriesRules = Object.entries(rules);
  if (options.eliminateEmptyCSSRules && entriesRules.length === 0) {
    return [];
  } else {
    const className = getUniqElementClassName(elementID, elements);
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
  }
};

const makeTree = (
  targetID: string,
  elements: IElements,
  options: IFormatterCSSOptions
): string[] => {
  const target = selectElementWithFallback(targetID, elements);
  const lines = targetToLines(targetID, elements, options);
  if (target.type !== EElementType.Component) {
    lines.push(
      ...target.children.reduce<string[]>((res, childID) => {
        const childTree = makeTree(childID, elements, options);
        return childTree.length === 0 ? res : res.concat('', childTree);
      }, [])
    );
  }
  return lines;
};

export const toCSS = (targetID: string, elements: IElements, options: IFormatterCSSOptions) =>
  makeTree(targetID, elements, options)
    .map(asLine)
    .join('\n');

interface IFormatterCSSOptions {
  eliminateEmptyCSSRules: boolean;
}
