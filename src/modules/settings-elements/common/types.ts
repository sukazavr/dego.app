import produce from 'immer';

import { Lens } from '@grammarly/focal';

import { EElementType, IElementFlexProps, IElementGeneric } from '../../../generic/states/elements';
import { flexIsRow } from '../../../generic/style-helpers/flex';

export enum EElementVirtualType {
  FlexRow = 'FlexRow',
  FlexColumn = 'FlexColumn',
  Grid = 'Grid',
  Component = 'Component',
}

export const isVirtualTypeFlex = (virtualType: EElementVirtualType) =>
  virtualType === EElementVirtualType.FlexRow || virtualType === EElementVirtualType.FlexColumn;

export const lensElementVirtualType = Lens.create<IElementGeneric, EElementVirtualType>(
  ({ type, props }) => {
    if (type === EElementType.Flex) {
      return flexIsRow(props[EElementType.Flex].flexDirection)
        ? EElementVirtualType.FlexRow
        : EElementVirtualType.FlexColumn;
    } else if (type === EElementType.Grid) {
      return EElementVirtualType.Grid;
    } else {
      return EElementVirtualType.Component;
    }
  },
  (newValue, state) => {
    return produce(state, (draft) => {
      const isRow = newValue === EElementVirtualType.FlexRow;
      const isColumn = newValue === EElementVirtualType.FlexColumn;
      if (isRow || isColumn) {
        draft.type = EElementType.Flex;
        draft.props[EElementType.Flex].flexDirection = isRow ? 'row' : 'column';
      } else if (newValue === EElementVirtualType.Grid) {
        draft.type = EElementType.Grid;
      } else {
        draft.type = EElementType.Component;
      }
    });
  }
);

export const projectionFlexIconRotate = (state: IElementFlexProps) =>
  flexIsRow(state.flexDirection) ? 1 : undefined;
