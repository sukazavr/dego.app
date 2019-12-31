import { media, types } from 'typestyle';

import { graduations, TGraduationName, TThemeVariable } from '../tokens';
import { isNumber } from './type-guards';

export const tv = (key: TThemeVariable) => `var(--${key})`;
export const av = (key: string) => `var(--${key})`;

export const applyVariables = (variables: { [key: string]: string }) => {
  return Object.entries(variables).reduce((acc, [name, val]) => {
    acc[`--${name}`] = val;
    return acc;
  }, {} as Record<string, string>);
};

export const mediaGrad = (gradName: TGraduationName, style: types.NestedCSSProperties) => {
  const o: types.MediaQuery = {};
  const [minWidth, maxWidth] = graduations[gradName];
  if (minWidth > 0) {
    o.minWidth = `${minWidth}px`;
  }
  if (maxWidth > 0 && maxWidth !== Infinity) {
    o.maxWidth = `${minWidth}px`;
  }
  return media(o, style);
};

export const graduationToMediaCondition = (gradName: TGraduationName) => {
  const [minWidth, maxWidth] = graduations[gradName];
  return [
    minWidth > 0 ? `(min-width: ${minWidth}px)` : false,
    maxWidth > 0 && maxWidth !== Infinity ? `(max-width: ${maxWidth}px)` : false,
  ]
    .filter(Boolean)
    .join(' and ');
};

type TBoxUnit = number | string;
const boxUnitToString = (value: TBoxUnit): string => {
  if (isNumber(value)) {
    return `${value}rem`;
  }
  return value;
};

export const gridSpaced = (margin: TBoxUnit) => {
  const spacing = boxUnitToString(margin);
  return {
    marginTop: important(`-${spacing}`),
    marginLeft: important(`-${spacing}`),
    '&>*': {
      marginTop: important(spacing),
      marginLeft: important(spacing),
    },
  } as types.CSSProperties;
};

export const verticalSpaced = (margin: TBoxUnit) => {
  const spacing = boxUnitToString(margin);
  return {
    '&>*': {
      marginBottom: important(spacing),
    },
    '&>*:last-child': {
      marginBottom: important(0),
    },
  } as types.CSSProperties;
};

export const horizontalSpaced = (margin: TBoxUnit) => {
  const spacing = boxUnitToString(margin);
  return {
    '&>*': {
      marginRight: important(spacing),
    },
    '&>*:last-child': {
      marginRight: important(0),
    },
  } as types.CSSProperties;
};

const important = (val: string | number) => `${val}!important`;
