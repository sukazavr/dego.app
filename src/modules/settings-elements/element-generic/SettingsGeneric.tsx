import React from 'react';
import { style } from 'typestyle';

import { Lens } from '@grammarly/focal';

import { Button } from '../../../generic/components/Button';
import { ButtonGroup } from '../../../generic/components/ButtonGroup';
import {
    BODY_ID, CANVAS_ID, ECanvasType, EElementType, IElementCanvas, IElementGeneric,
} from '../../../generic/states/elements';
import { IState, stateApp$ } from '../../../generic/states/state-app';
import { useObservable, useObservableFabric } from '../../../generic/supply/react-helpers';
import {
    isElementGeneric, isElementGenericOrBody, isNotNull,
} from '../../../generic/supply/type-guards';
import { scrollRegular } from '../../../generic/theme';
import { createTreeElement } from '../../tree/utils';
import { SettingsComponent } from '../common/SettingsComponent/SettingsComponent';
import { SettingsFlexChild } from '../common/SettingsFlexChild/SettingsFlexChild';
import { SettingsFlexParent } from '../common/SettingsFlexParent/SettingsFlexParent';
import { SettingsGridParent } from '../common/SettingsGridParent/SettingsGridParent';
import { EElementVirtualType, isVirtualTypeFlex, lensElementVirtualType } from '../common/types';

interface IProps {
  elementID: string;
}

export const SettingsGeneric = React.memo<IProps>(({ elementID }) => {
  const { element$, parent$, virtualType$, setVirtualType } = React.useMemo(() => {
    const memoElement$ = stateApp$.lens(lensFocusedElementGeneric);
    const memoVirtualType$ = memoElement$.lens(lensElementVirtualType);
    return {
      element$: memoElement$,
      parent$: stateApp$.view(projectionElementParent),
      virtualType$: memoVirtualType$,
      setVirtualType: (type: EElementVirtualType) => () => memoVirtualType$.set(type),
    };
  }, []);
  const virtualType = useObservable(virtualType$);
  const isParentFlex = useObservableFabric(
    () => parent$.view((_) => _.type === EElementType.Flex),
    [parent$]
  );
  return (
    <div className={$container}>
      <div className={$wrapper}>
        <ButtonGroup style={{ padding: '1rem' }}>
          <Button
            icon="flexRow"
            isActive={virtualType === EElementVirtualType.FlexRow}
            onClick={setVirtualType(EElementVirtualType.FlexRow)}
          />
          <Button
            icon="flexColumn"
            isActive={virtualType === EElementVirtualType.FlexColumn}
            onClick={setVirtualType(EElementVirtualType.FlexColumn)}
          />
          <Button
            icon="grid"
            isActive={virtualType === EElementVirtualType.Grid}
            onClick={setVirtualType(EElementVirtualType.Grid)}
          />
          {elementID !== BODY_ID && (
            <Button
              icon="component"
              isActive={virtualType === EElementVirtualType.Component}
              onClick={setVirtualType(EElementVirtualType.Component)}
            />
          )}
        </ButtonGroup>
        {isParentFlex && <SettingsFlexChild element$={element$} parent$={parent$} />}
        {isVirtualTypeFlex(virtualType) && (
          <SettingsFlexParent element$={element$} parent$={parent$} />
        )}
        {virtualType === EElementVirtualType.Grid && (
          <SettingsGridParent element$={element$} parent$={parent$} />
        )}
        {virtualType === EElementVirtualType.Component && <SettingsComponent element$={element$} />}
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

const lensFocusedElementGeneric = Lens.create<IState, IElementGeneric>(
  (state) => {
    const focusedID = state.tree.focusedID;
    if (isNotNull(focusedID)) {
      const element = state.elements[focusedID];
      if (isElementGenericOrBody(element)) {
        return element as IElementGeneric;
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

export const projectionElementParent = (state: IState) => {
  const focusedID = state.tree.focusedID;
  if (isNotNull(focusedID)) {
    const element = state.elements[focusedID];
    if (isElementGeneric(element)) {
      return state.elements[element.parent] as IElementGeneric;
    }
  }
  const canvas = state.elements[CANVAS_ID] as IElementCanvas;
  const virtualCanvas = createTreeElement();
  if (canvas.type === ECanvasType.Div) {
    virtualCanvas.type = EElementType.Component;
  } else {
    const flexProps = virtualCanvas.props[EElementType.Flex];
    flexProps.flexDirection = canvas.type === ECanvasType.FlexRow ? 'row' : 'column';
  }
  return virtualCanvas;
};
