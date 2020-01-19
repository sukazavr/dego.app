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
    IElementFlexChildProps, IElementFlexParentProps,
} from '../../../../generic/states/elements';
import { flexDirectionIsRow } from '../../../../generic/style-helpers/flex';
import { useObservable } from '../../../../generic/supply/react-helpers';
import { TooltipProvider } from '../../../tooltip/TooltipProvider';
import { unitOptions } from '../../../unit-input/options';
import { UnitInput } from '../../../unit-input/UnitInput';

interface IProps {
  flexChildProps$: Atom<IElementFlexChildProps>;
  parentFlexParentProps$: ReadOnlyAtom<IElementFlexParentProps>;
}

enum EPreset {
  Shrink,
  Grow,
  None,
  Custom,
}

export const Sizing = React.memo<IProps>(({ flexChildProps$, parentFlexParentProps$ }) => {
  const {
    iconRotate$,
    preset$,
    setPreset,
    flexGrow$,
    flexShrink$,
    flexBasis$,
  } = React.useMemo(() => {
    const memoPreset$ = flexChildProps$.lens(lensPreset);
    return {
      iconRotate$: parentFlexParentProps$.view((state) =>
        flexDirectionIsRow(state.flexDirection) ? 1 : undefined
      ),
      preset$: memoPreset$,
      setPreset: (preset: EPreset) => () => memoPreset$.set(preset),
      flexGrow$: flexChildProps$.lens('flexGrow'),
      flexShrink$: flexChildProps$.lens('flexShrink'),
      flexBasis$: flexChildProps$.lens('flexBasis'),
    };
  }, [flexChildProps$, parentFlexParentProps$]);
  const preset = useObservable(preset$);
  const iconRotate = useObservable(iconRotate$);
  return (
    <TandemGroup>
      <TooltipProvider />
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
              data-tip="flex: 0 1 auto (default)"
            />
            <Button
              icon="flexGrow"
              iconRotate={iconRotate}
              isActive={preset === EPreset.Grow}
              onClick={setPreset(EPreset.Grow)}
              data-tip="flex: 1 1 0%"
            />
            <Button
              icon="flexNone"
              iconRotate={iconRotate}
              isActive={preset === EPreset.None}
              onClick={setPreset(EPreset.None)}
              data-tip="flex: none"
            />
            <Button
              icon="more"
              isActive={preset === EPreset.Custom}
              onClick={setPreset(EPreset.Custom)}
              data-tip="custom"
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

const lensPreset = Lens.create<IElementFlexChildProps, EPreset>(
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
        draft.flexShrink = unitOptions.int.numberToUnit(1);
        draft.flexBasis = unitOptions.auto.defaultUnit;
      } else if (newValue === EPreset.Grow) {
        draft.flexGrow = unitOptions.int.numberToUnit(1);
        draft.flexShrink = unitOptions.int.numberToUnit(1);
        draft.flexBasis = unitOptions['%'].defaultUnit;
      } else if (newValue === EPreset.None) {
        draft.flexGrow = unitOptions.int.defaultUnit;
        draft.flexShrink = unitOptions.int.defaultUnit;
        draft.flexBasis = unitOptions.auto.defaultUnit;
      } else {
        draft.flexGrow = unitOptions.int.numberToUnit(1);
      }
    });
  }
);
