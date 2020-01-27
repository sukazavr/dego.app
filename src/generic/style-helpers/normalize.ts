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
      style.alignContent = flexParentProps.alignContent;
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
  setSpacing(style, element.props.Common, 'padding');
  setSpacing(style, element.props.Common, 'margin');
  return style;
};

const setSize = (style: types.NestedCSSProperties, props: IElementCommonProps) => {
  const width = unitToString(props.width);
  const height = unitToString(props.height);
  const minWidth = unitToString(props.minWidth);
  const minHeight = unitToString(props.minHeight);
  const maxWidth = unitToString(props.maxWidth);
  const maxHeight = unitToString(props.maxHeight);
  if (width !== 'auto') {
    style.width = width;
  }
  if (height !== 'auto') {
    style.height = height;
  }
  if (minWidth !== 'auto') {
    style.minWidth = minWidth;
  }
  if (minHeight !== 'auto') {
    style.minHeight = minHeight;
  }
  if (maxWidth !== 'auto') {
    style.maxWidth = maxWidth;
  }
  if (maxHeight !== 'auto') {
    style.maxHeight = maxHeight;
  }
};

const setSpacing = (
  style: types.NestedCSSProperties,
  props: IElementCommonProps,
  scope: 'padding' | 'margin'
) => {
  const scopedProps = props[scope];
  const left = unitToString(scopedProps.left);
  const top = unitToString(scopedProps.top);
  const right = unitToString(scopedProps.right);
  const bottom = unitToString(scopedProps.bottom);
  const hasLeft = left !== '0px';
  const hasTop = top !== '0px';
  const hasRight = right !== '0px';
  const hasBottom = bottom !== '0px';
  if (hasLeft && hasTop && hasRight && hasBottom) {
    if (left === right) {
      if (top === bottom) {
        if (left === top) {
          style[scope] = top;
        } else {
          style[scope] = `${top} ${left}`;
        }
      } else {
        style[scope] = `${top} ${left} ${bottom}`;
      }
    } else {
      style[scope] = `${top} ${right} ${bottom} ${left}`;
    }
  } else {
    if (hasLeft) {
      style[`${scope}Left` as 'paddingLeft'] = left;
    }
    if (hasTop) {
      style[`${scope}Top` as 'paddingTop'] = top;
    }
    if (hasRight) {
      style[`${scope}Right` as 'paddingRight'] = right;
    }
    if (hasBottom) {
      style[`${scope}Bottom` as 'paddingBottom'] = bottom;
    }
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
