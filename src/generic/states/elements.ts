import { Lens } from '@grammarly/focal';

import { unitOptions } from '../../modules/unit-input/options';
import { TFlexDirection } from '../style-helpers/flex';
import { PRESET_COLORS } from '../style-helpers/preset-colors';
import {
    isDefined, isElementBody, isElementGeneric, isElementGenericOrBody,
} from '../supply/type-guards';
import { IUnit } from './unit';

// TODO: auto gen from defaultElements and defaultGenericElement
export const ELEMENTS_SCHEMA_VERSION = 4;
export const CANVAS_ID = 'canvas';
export const BODY_ID = 'body';

export enum EElementType {
  Flex = 'Flex',
  Grid = 'Grid',
  Component = 'Component',
}

export enum ECanvasType {
  Div = 'Div',
  FlexRow = 'FlexRow',
  FlexColumn = 'FlexColumn',
}

export type TElementAny = IElementCanvas | IElementBody | IElementGeneric;

export type TElementGenericOrBody = IElementBody | IElementGeneric;

export interface IElements {
  [ID: string]: TElementAny;
}

export interface IGenericPropsSpacing {
  top: IUnit;
  left: IUnit;
  right: IUnit;
  bottom: IUnit;
}

type TGenericPropsOverflow = 'auto' | 'hidden' | 'scroll' | 'visible';

export interface IElementCommonProps {
  width: IUnit;
  height: IUnit;
  minWidth: IUnit;
  minHeight: IUnit;
  maxWidth: IUnit;
  maxHeight: IUnit;
  padding: IGenericPropsSpacing;
  margin: IGenericPropsSpacing;
  overflowX: TGenericPropsOverflow;
  overflowY: TGenericPropsOverflow;
}

export const defaultElementCommonProps: IElementCommonProps = {
  width: unitOptions.auto.defaultUnit,
  height: unitOptions.auto.defaultUnit,
  minWidth: unitOptions.auto.defaultUnit,
  minHeight: unitOptions.auto.defaultUnit,
  maxWidth: unitOptions.auto.defaultUnit,
  maxHeight: unitOptions.auto.defaultUnit,
  padding: {
    top: unitOptions.px.defaultUnit,
    left: unitOptions.px.defaultUnit,
    right: unitOptions.px.defaultUnit,
    bottom: unitOptions.px.defaultUnit,
  },
  margin: {
    top: unitOptions.px.defaultUnit,
    left: unitOptions.px.defaultUnit,
    right: unitOptions.px.defaultUnit,
    bottom: unitOptions.px.defaultUnit,
  },
  overflowX: 'visible',
  overflowY: 'visible',
};

export interface IElementMockupProps {
  hasBG: boolean;
  BGColor: string;
  BGOpacity: IUnit;
  hasRandomText: boolean;
  randomTextLength: IUnit;
  instances: IUnit;
}

export const defaultElementMockupProps: IElementMockupProps = {
  hasBG: false,
  BGColor: PRESET_COLORS[5],
  BGOpacity: unitOptions.float.numberToUnit(1),
  hasRandomText: false,
  randomTextLength: unitOptions.int.defaultUnit,
  instances: unitOptions.int.numberToUnit(1),
};

export interface IElementFlexChildProps {
  flexGrow: IUnit;
  flexShrink: IUnit;
  flexBasis: IUnit;
  isAlignOverridden: boolean;
  alignSelf: 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';
  isOrderOverridden: boolean;
  order: IUnit;
}

export const defaultElementFlexChildProps: IElementFlexChildProps = {
  flexGrow: unitOptions.int.defaultUnit,
  flexShrink: unitOptions.int.numberToUnit(1),
  flexBasis: unitOptions.auto.defaultUnit,
  isAlignOverridden: false,
  alignSelf: 'flex-end',
  isOrderOverridden: false,
  order: unitOptions.int.numberToUnit(1),
};

export interface IElementFlexParentProps {
  flexDirection: TFlexDirection;
  alignItems: 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';
  justifyContent:
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'space-between'
    | 'space-around'
    | 'space-evenly';
  spacingBetweenChildren: IUnit;
  flexWrap: 'nowrap' | 'wrap' | 'wrap-reverse';
  alignContent:
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'space-between'
    | 'space-around'
    | 'space-evenly'
    | 'stretch';
}

export const defaultElementFlexParentProps: IElementFlexParentProps = {
  flexDirection: 'row',
  alignItems: 'stretch',
  justifyContent: 'flex-start',
  spacingBetweenChildren: unitOptions.px.defaultUnit,
  flexWrap: 'nowrap',
  alignContent: 'stretch',
};

export interface IElementGridChildProps {}

export const defaultElementGridChildProps: IElementGridChildProps = {};

export interface IElementGridParentProps {}

export const defaultElementGridParentProps: IElementGridParentProps = {};

export interface IElementComponentProps {
  tag: string;
}

export const defaultElementComponentProps: IElementComponentProps = {
  tag: 'div',
};

export interface IElementCanvas {
  id: typeof CANVAS_ID;
  type: ECanvasType;
  width: IUnit;
  height: IUnit;
  isTransparent: boolean;
  isBorderless: boolean;
}

export interface IElementBody {
  id: typeof BODY_ID;
  name: string;
  children: string[];
  type: EElementType.Flex | EElementType.Grid;
  props: {
    FlexChild: IElementFlexChildProps;
    FlexParent: IElementFlexParentProps;
    GridParent: IElementGridParentProps;
    Common: IElementCommonProps;
  };
  isExpanded: boolean;
}

export interface IElementGeneric {
  id: string;
  name: string;
  parent: string;
  children: string[];
  type: EElementType;
  props: {
    FlexChild: IElementFlexChildProps;
    FlexParent: IElementFlexParentProps;
    GridChild: IElementGridChildProps;
    GridParent: IElementGridParentProps;
    Component: IElementComponentProps;
    Common: IElementCommonProps;
    Mockup: IElementMockupProps;
  };
  isExpanded: boolean;
}

export const defaultElements: IElements = {
  [CANVAS_ID]: {
    id: CANVAS_ID,
    type: ECanvasType.Div,
    width: unitOptions.px.numberToUnit(800),
    height: unitOptions.px.numberToUnit(800),
    isTransparent: true,
    isBorderless: false,
  },
  [BODY_ID]: {
    id: BODY_ID,
    name: '',
    children: [],
    type: EElementType.Flex,
    props: {
      FlexChild: defaultElementFlexChildProps,
      FlexParent: defaultElementFlexParentProps,
      GridParent: defaultElementGridParentProps,
      Common: defaultElementCommonProps,
    },
    isExpanded: true,
  },
};

export const getDefaultProps = () => ({
  FlexChild: { ...defaultElementFlexChildProps },
  FlexParent: { ...defaultElementFlexParentProps },
  GridChild: { ...defaultElementGridChildProps },
  GridParent: { ...defaultElementGridParentProps },
  Component: { ...defaultElementComponentProps },
  Common: { ...defaultElementCommonProps },
  Mockup: { ...defaultElementMockupProps },
});

export const lensElementAny = (id: string) => {
  return Lens.create<IElements, TElementAny>(
    (state) => {
      const element = state[id];
      return isDefined(element) ? element : defaultElements[BODY_ID];
    },
    (newValue, state) => {
      return { ...state, [id]: newValue };
    }
  );
};

export const lensElementCanvas = Lens.create<IElements, IElementCanvas>(
  (state) => state[CANVAS_ID] as IElementCanvas,
  (newValue, state) => {
    return { ...state, [CANVAS_ID]: newValue };
  }
);

export const lensElementBody = Lens.create<IElements, IElementBody>(
  (state) => state[BODY_ID] as IElementBody,
  (newValue, state) => {
    return { ...state, [BODY_ID]: newValue };
  }
);

export const lensElementProps = Lens.create<TElementAny, IElementGeneric['props']>(
  (state) => {
    const defaultProps = getDefaultProps();
    if (isElementGenericOrBody(state)) {
      return { ...defaultProps, ...state.props };
    } else {
      return defaultProps;
    }
  },
  (newValue, state) => {
    if (isElementGeneric(state)) {
      return {
        ...state,
        props: newValue,
      };
    } else if (isElementBody(state)) {
      return {
        ...state,
        props: {
          FlexChild: newValue.FlexChild,
          FlexParent: newValue.FlexParent,
          GridParent: newValue.GridParent,
          Common: newValue.Common,
        },
      };
    } else {
      return state;
    }
  }
);
