import React from 'react';
import { style } from 'typestyle';

import { Lens } from '@grammarly/focal';

import { Button } from '../../../generic/components/Button';
import { ButtonGroup } from '../../../generic/components/ButtonGroup';
import {
    BODY_ID, CANVAS_ID, ECanvasType, EElementType, IElementCanvas, lensElementProps, TElementAny,
} from '../../../generic/states/elements';
import { IState, stateApp$ } from '../../../generic/states/state-app';
import { useObservable } from '../../../generic/supply/react-helpers';
import {
    isElementGeneric, isElementGenericOrBody, isNotNull,
} from '../../../generic/supply/type-guards';
import { scrollRegular } from '../../../generic/theme';
import { TooltipProvider } from '../../tooltip/TooltipProvider';
import { createTreeElement } from '../../tree/utils';
import { SettingsCommon } from '../common/SettingsCommon/SettingsCommon';
import { SettingsComponent } from '../common/SettingsComponent/SettingsComponent';
import { SettingsFlexChild } from '../common/SettingsFlexChild/SettingsFlexChild';
import { SettingsFlexParent } from '../common/SettingsFlexParent/SettingsFlexParent';
import { SettingsGridChild } from '../common/SettingsGridChild/SettingsGridChild';
import { SettingsGridParent } from '../common/SettingsGridParent/SettingsGridParent';
import { SettingsMockup } from '../common/SettingsMockup/SettingsMockup';
import { EElementVirtualType, isVirtualTypeFlex, lensElementVirtualType } from '../common/types';

interface IProps {
  elementID: string;
}

export const SettingsGeneric = React.memo<IProps>(({ elementID }) => {
  const {
    parentType$,
    flexChildProps$,
    flexParentProps$,
    componentProps$,
    commonProps$,
    mockupProps$,
    parentFlexParentProps$,
    virtualType$,
    setVirtualType,
  } = React.useMemo(() => {
    const memoElement$ = stateApp$.lens(lensFocusedElementGeneric);
    const memoElementParent$ = stateApp$.view(projectionElementParent);
    const memoElementProps$ = memoElement$.lens(lensElementProps);
    const memoElementParentProps$ = memoElementParent$.view(lensElementProps);
    const memoVirtualType$ = memoElement$.lens(lensElementVirtualType);
    return {
      parentType$: memoElementParent$.view('type'),
      flexChildProps$: memoElementProps$.lens('FlexChild'),
      flexParentProps$: memoElementProps$.lens('FlexParent'),
      componentProps$: memoElementProps$.lens('Component'),
      commonProps$: memoElementProps$.lens('Common'),
      mockupProps$: memoElementProps$.lens('Mockup'),
      parentFlexParentProps$: memoElementParentProps$.view('FlexParent'),
      virtualType$: memoVirtualType$,
      setVirtualType: (type: EElementVirtualType) => () => memoVirtualType$.set(type),
    };
  }, []);
  const virtualType = useObservable(virtualType$);
  const parentType = useObservable(parentType$);
  return (
    <div className={$container}>
      <div className={$wrapper}>
        <TooltipProvider />
        <ButtonGroup style={{ padding: '1rem' }}>
          <Button
            icon="flexRow"
            isActive={virtualType === EElementVirtualType.FlexRow}
            onClick={setVirtualType(EElementVirtualType.FlexRow)}
            data-tip="flex-direction: row"
            data-place="bottom"
          />
          <Button
            icon="flexColumn"
            isActive={virtualType === EElementVirtualType.FlexColumn}
            onClick={setVirtualType(EElementVirtualType.FlexColumn)}
            data-tip="flex-direction: column"
            data-place="bottom"
          />
          <Button
            icon="grid"
            isActive={virtualType === EElementVirtualType.Grid}
            onClick={setVirtualType(EElementVirtualType.Grid)}
            data-tip="display: grid"
            data-place="bottom"
          />
          {elementID !== BODY_ID && (
            <Button
              icon="component"
              isActive={virtualType === EElementVirtualType.Component}
              onClick={setVirtualType(EElementVirtualType.Component)}
              data-tip="visual placeholder"
              data-place="bottom"
            />
          )}
        </ButtonGroup>
        {parentType === EElementType.Flex && (
          <SettingsFlexChild
            flexChildProps$={flexChildProps$}
            parentFlexParentProps$={parentFlexParentProps$}
          />
        )}
        {parentType === EElementType.Grid && <SettingsGridChild />}
        {isVirtualTypeFlex(virtualType) && (
          <SettingsFlexParent flexParentProps$={flexParentProps$} />
        )}
        {virtualType === EElementVirtualType.Grid && <SettingsGridParent />}
        {virtualType === EElementVirtualType.Component && (
          <SettingsComponent componentProps$={componentProps$} />
        )}
        <SettingsCommon commonProps$={commonProps$} />
        {elementID !== BODY_ID && (
          <SettingsMockup mockupProps$={mockupProps$} virtualType={virtualType} />
        )}
      </div>
    </div>
  );
});

const $container = style(scrollRegular, {
  overflow: 'auto',
});

const $wrapper = style({
  minWidth: '180px',
});

const lensFocusedElementGeneric = Lens.create<IState, TElementAny>(
  (state) => {
    const focusedID = state.tree.focusedID;
    if (isNotNull(focusedID)) {
      const element = state.elements[focusedID];
      if (isElementGenericOrBody(element)) {
        return element;
      }
    }
    return createTreeElement();
  },
  (newValue, state) => {
    const focusedID = state.tree.focusedID;
    if (isNotNull(focusedID) && isElementGenericOrBody(state.elements[focusedID])) {
      return {
        ...state,
        elements: {
          ...state.elements,
          [focusedID]: newValue,
        },
      };
    } else {
      return state;
    }
  }
);

const projectionElementParent = (state: IState) => {
  const focusedID = state.tree.focusedID;
  if (isNotNull(focusedID)) {
    const element = state.elements[focusedID];
    if (isElementGeneric(element)) {
      return state.elements[element.parent];
    }
  }
  const canvas = state.elements[CANVAS_ID] as IElementCanvas;
  const virtualCanvas = createTreeElement();
  if (canvas.type === ECanvasType.Div) {
    virtualCanvas.type = EElementType.Component;
  } else {
    virtualCanvas.props.FlexParent.flexDirection =
      canvas.type === ECanvasType.FlexRow ? 'row' : 'column';
  }
  return virtualCanvas;
};
