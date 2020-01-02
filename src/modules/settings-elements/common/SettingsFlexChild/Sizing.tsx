import produce from 'immer';
import React from 'react';

import { Atom, Lens, ReadOnlyAtom } from '@grammarly/focal';

import { Button } from '../../../../generic/components/Button';
import { ButtonGroup } from '../../../../generic/components/ButtonGroup';
import { Label } from '../../../../generic/components/Label';
import { Stack } from '../../../../generic/components/Stack';
import { Tandem } from '../../../../generic/components/Tandem';
import { TandemGroup } from '../../../../generic/components/TandemGroup';
import {
    IElementFlexProps, IElementGeneric, lensElementFlexProps,
} from '../../../../generic/states/elements';
import { useObservable } from '../../../../generic/supply/react-helpers';
import { unitOptions } from '../../../unit-input/options';
import { UnitInput } from '../../../unit-input/UnitInput';
import { projectionFlexIconRotate } from '../types';

interface IProps {
  element$: Atom<IElementGeneric>;
  parent$: ReadOnlyAtom<IElementGeneric>;
}

enum EPreset {
  Shrink,
  Grow,
  None,
  Custom,
}

export const Sizing = React.memo<IProps>(({ element$, parent$ }) => {
  const {
    iconRotate$,
    preset$,
    setPreset,
    flexGrow$,
    flexShrink$,
    flexBasis$,
  } = React.useMemo(() => {
    const flexProps$ = element$.lens(lensElementFlexProps);
    const memoPreset$ = flexProps$.lens(lensPreset);
    return {
      iconRotate$: parent$.view(lensElementFlexProps).view(projectionFlexIconRotate),
      preset$: memoPreset$,
      setPreset: (preset: EPreset) => () => memoPreset$.set(preset),
      flexGrow$: flexProps$.lens('flexGrow'),
      flexShrink$: flexProps$.lens('flexShrink'),
      flexBasis$: flexProps$.lens('flexBasis'),
    };
  }, [element$, parent$]);
  const preset = useObservable(preset$);
  const iconRotate = useObservable(iconRotate$);
  return (
    <TandemGroup>
      <Tandem
        leftMax={50}
        left={<Label children="Sizing" />}
        right={
          <ButtonGroup>
            <Button
              icon="flexShrink"
              iconRotate={iconRotate}
              isActive={preset === EPreset.Shrink}
              onClick={setPreset(EPreset.Shrink)}
            />
            <Button
              icon="flexGrow"
              iconRotate={iconRotate}
              isActive={preset === EPreset.Grow}
              onClick={setPreset(EPreset.Grow)}
            />
            <Button
              icon="flexNone"
              iconRotate={iconRotate}
              isActive={preset === EPreset.None}
              onClick={setPreset(EPreset.None)}
            />
            <Button
              icon="more"
              isActive={preset === EPreset.Custom}
              onClick={setPreset(EPreset.Custom)}
            />
          </ButtonGroup>
        }
      />
      <Tandem
        leftMax={50}
        left={null}
        right={
          <Stack isInline spacing={1}>
            <Stack>
              <UnitInput options={['int']} unit$={flexGrow$} />
              <Label children="Grow" />
            </Stack>
            <Stack>
              <UnitInput options={['int']} unit$={flexShrink$} />
              <Label children="Shrink" />
            </Stack>
            <Stack>
              <UnitInput options={['auto', '%', 'em', 'px']} unit$={flexBasis$} />
              <Label children="Basis" />
            </Stack>
          </Stack>
        }
      />
    </TandemGroup>
  );
});

const lensPreset = Lens.create<IElementFlexProps, EPreset>(
  ({ flexGrow, flexShrink, flexBasis }) => {
    const grow = flexGrow.n;
    const shrink = flexShrink.n;
    const basis = flexBasis.s;
    if (grow === 0 && shrink === 1 && basis === 'auto') {
      return EPreset.Shrink;
    } else if (grow === 1 && shrink === 1 && basis === '%' && flexBasis.n === 0) {
      return EPreset.Grow;
    } else if (grow === 0 && shrink === 0 && basis === 'auto') {
      return EPreset.None;
    } else {
      return EPreset.Custom;
    }
  },
  (newValue, state) => {
    return produce(state, (draft) => {
      if (newValue === EPreset.Shrink) {
        draft.flexGrow = unitOptions.int.defaultUnit;
        draft.flexShrink = unitOptions.int.stringToUnit('1');
        draft.flexBasis = unitOptions.auto.defaultUnit;
      } else if (newValue === EPreset.Grow) {
        draft.flexGrow = unitOptions.int.stringToUnit('1');
        draft.flexShrink = unitOptions.int.stringToUnit('1');
        draft.flexBasis = unitOptions['%'].defaultUnit;
      } else if (newValue === EPreset.None) {
        draft.flexGrow = unitOptions.int.defaultUnit;
        draft.flexShrink = unitOptions.int.defaultUnit;
        draft.flexBasis = unitOptions.auto.defaultUnit;
      } else {
        draft.flexGrow = unitOptions.int.stringToUnit('1');
      }
    });
  }
);
