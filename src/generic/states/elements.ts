import { Lens } from '@grammarly/focal';

import { unitOptions } from '../../modules/unit-input/options';
import { TFlexDirection } from '../style-helpers/flex';
import { isDefined } from '../supply/type-guards';
import { IUnit } from './unit';

// TODO: auto gen from defaultElements and defaultGenericElement
export const ELEMENTS_SCHEMA_VERSION = 1;
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

export interface IElementFlexProps {
  width: IUnit;
  height: IUnit;
  flexDirection: TFlexDirection;
  flexGrow: IUnit;
  flexShrink: IUnit;
  flexBasis: IUnit;
  isAlignOverridden: boolean;
  alignSelf: 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';
  isOrderOverridden: boolean;
  order: IUnit;
  alignItems: 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';
  justifyContent:
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'space-between'
    | 'space-around'
    | 'space-evenly';
}

export const defaultElementFlexProps: IElementFlexProps = {
  flexDirection: 'row',
  width: unitOptions.auto.defaultUnit,
  height: unitOptions.auto.defaultUnit,
  flexGrow: unitOptions.int.defaultUnit,
  flexShrink: unitOptions.int.stringToUnit('1'),
  flexBasis: unitOptions.auto.defaultUnit,
  isAlignOverridden: false,
  alignSelf: 'flex-end',
  isOrderOverridden: false,
  order: unitOptions.int.stringToUnit('1'),
  alignItems: 'stretch',
  justifyContent: 'flex-start',
};

export interface IElementGridProps {
  width: IUnit;
  height: IUnit;
}

export const defaultElementGridProps: IElementGridProps = {
  width: unitOptions.auto.defaultUnit,
  height: unitOptions.auto.defaultUnit,
};

export interface IElementComponentProps {
  width: IUnit;
  height: IUnit;
}

export const defaultElementComponentProps: IElementComponentProps = {
  width: unitOptions.auto.defaultUnit,
  height: unitOptions.auto.defaultUnit,
};

export const defaultElements: IElements = {
  [CANVAS_ID]: {
    id: CANVAS_ID,
    width: unitOptions.px.stringToUnit('800px'),
    height: unitOptions.px.stringToUnit('1000px'),
    isTransparent: true,
    type: ECanvasType.Div,
  },
  [BODY_ID]: {
    id: BODY_ID,
    name: '',
    children: [],
    type: EElementType.Flex,
    props: {
      Flex: defaultElementFlexProps,
      Grid: defaultElementGridProps,
    },
    isExpanded: true,
  },
};

export interface IElementCanvas {
  id: typeof CANVAS_ID;
  width: IUnit;
  height: IUnit;
  type: ECanvasType;
  isTransparent: boolean;
}

export interface IElementBody {
  id: typeof BODY_ID;
  name: string;
  children: string[];
  type: EElementType.Flex | EElementType.Grid;
  props: {
    [EElementType.Flex]: IElementFlexProps;
    [EElementType.Grid]: IElementGridProps;
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
    [EElementType.Flex]: IElementFlexProps;
    [EElementType.Grid]: IElementGridProps;
    [EElementType.Component]: IElementComponentProps;
  };
  isExpanded: boolean;
}

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

export const lensElementFlexProps = Lens.create<IElementGeneric, IElementFlexProps>(
  (state) => state.props[EElementType.Flex],
  (newValue, state) => {
    return {
      ...state,
      props: {
        ...state.props,
        [EElementType.Flex]: newValue,
      },
    } as IElementGeneric;
  }
);
