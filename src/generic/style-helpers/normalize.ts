import { types } from 'typestyle';

import { unitToString } from '../../modules/unit-input/options';
import {
    EElementType, IElementCommonProps, IElementFlexChildProps, IElementFlexParentProps,
    TElementGenericOrBody,
} from '../states/elements';
import { tv } from '../supply/style-helpers';
import { isElementGeneric } from '../supply/type-guards';
import { flexDirectionIsRow } from './flex';
import { PRESET_COLORS_LIGHT } from './preset-colors';

export const getNormalizedElementCSSProperties = ({
  element,
  parentType,
  excludeMockupStyle = false,
}: {
  element: TElementGenericOrBody;
  parentType: EElementType;
  excludeMockupStyle?: boolean;
}) => {
  const style: types.NestedCSSProperties = {};
  if (parentType === EElementType.Flex) {
    const flexChildProps = element.props.FlexChild;
    setFlex(style, flexChildProps);
    if (flexChildProps.isAlignOverridden) {
      style.alignSelf = flexChildProps.alignSelf;
    }
    if (flexChildProps.isOrderOverridden) {
      style.order = flexChildProps.order.n;
    }
  }
  if (element.type === EElementType.Flex) {
    const flexParentProps = element.props.FlexParent;
    style.display = 'flex';
    if (flexParentProps.flexDirection !== 'row') {
      style.flexDirection = flexParentProps.flexDirection;
    }
    if (flexParentProps.alignItems !== 'stretch') {
      style.alignItems = flexParentProps.alignItems;
    }
    if (flexParentProps.justifyContent !== 'flex-start') {
      style.justifyContent = flexParentProps.justifyContent;
    }
    setSpacingBetweenChildren(style, flexParentProps);
    if (flexParentProps.flexWrap !== 'nowrap') {
      style.flexWrap = flexParentProps.flexWrap;
    }
    if (flexParentProps.alignContent !== 'stretch') {
      style.flexWrap = flexParentProps.flexWrap;
    }
  }
  if (!excludeMockupStyle && isElementGeneric(element)) {
    const mockupProps = element.props.Mockup;
    style.color = tv('base900');
    if (mockupProps.hasBG) {
      style.backgroundColor = mockupProps.BGColor;
      if (!PRESET_COLORS_LIGHT.includes(mockupProps.BGColor)) {
        style.color = tv('base');
      }
    }
  }
  setSize(style, element.props.Common);
  return style;
};

const setSize = (style: types.NestedCSSProperties, props: IElementCommonProps) => {
  const width = unitToString(props.width);
  const height = unitToString(props.height);
  if (width !== 'auto') {
    style.width = width;
  }
  if (height !== 'auto') {
    style.height = height;
  }
};

const setFlex = (
  style: types.NestedCSSProperties,
  { flexGrow, flexShrink, flexBasis }: IElementFlexChildProps
) => {
  const grow = flexGrow.n;
  const shrink = flexShrink.n;
  const basis = unitToString(flexBasis);
  if (basis === 'auto') {
    if (grow === 0 && shrink === 1) {
      return;
    }
    if (grow === 1 && shrink === 1) {
      style.flex = 'auto';
      return;
    } else if (grow === 0 && shrink === 0) {
      style.flex = 'none';
      return;
    }
  } else if (grow !== 0 && shrink !== 1) {
    style.flex = `${grow} ${shrink} ${basis}`;
    return;
  }
  style.flexBasis = basis;
  if (grow !== 0) {
    style.flexGrow = grow;
  }
  if (shrink !== 1) {
    style.flexShrink = shrink;
  }
};

const setSpacingBetweenChildren = (
  style: types.NestedCSSProperties,
  { flexDirection, flexWrap, spacingBetweenChildren }: IElementFlexParentProps
) => {
  if (spacingBetweenChildren.n !== 0) {
    const spacing = unitToString(spacingBetweenChildren);
    if (flexWrap !== 'nowrap') {
      style.marginTop = `-${spacing}`;
      style.marginLeft = `-${spacing}`;
      style.$nest = {
        '&>*': {
          marginTop: spacing,
          marginLeft: spacing,
        },
      };
    } else {
      const dir = `margin${flexDirectionIsRow(flexDirection) ? 'Right' : 'Bottom'}`;
      style.$nest = {
        '&>*': {
          [dir]: spacing,
        },
        '&>*:last-child': {
          [dir]: 0,
        },
      };
    }
  }
};
