import React from 'react';

import { Atom, Lens } from '@grammarly/focal';

import { Button } from '../../../../generic/components/Button';
import { ButtonGroup } from '../../../../generic/components/ButtonGroup';
import { Label } from '../../../../generic/components/Label';
import { Panel } from '../../../../generic/components/Panel';
import { Switcher } from '../../../../generic/components/Switcher';
import { Tandem } from '../../../../generic/components/Tandem';
import { TandemGroup } from '../../../../generic/components/TandemGroup';
import { IElementFlexChildProps } from '../../../../generic/states/elements';
import { useObservable } from '../../../../generic/supply/react-helpers';
import { unitOptions } from '../../../unit-input/options';
import { UnitInput } from '../../../unit-input/UnitInput';

interface IProps {
  flexChildProps$: Atom<IElementFlexChildProps>;
}

enum EPreset {
  First,
  Last,
  Custom,
}

export const Order = React.memo<IProps>(({ flexChildProps$ }) => {
  const { preset$, setPreset, order$, isOrderOverridden$ } = React.useMemo(() => {
    const memoPreset$ = flexChildProps$.lens(lensPreset);
    return {
      preset$: memoPreset$,
      setPreset: (preset: EPreset) => () => memoPreset$.set(preset),
      order$: flexChildProps$.lens('order'),
      isOrderOverridden$: flexChildProps$.lens('isOrderOverridden'),
    };
  }, [flexChildProps$]);
  const preset = useObservable(preset$);
  const isOrderOverridden = useObservable(isOrderOverridden$);
  return (
    <>
      <Panel title="Override Order" isTransparent>
        <Switcher value$={isOrderOverridden$} />
      </Panel>
      {isOrderOverridden && (
        <TandemGroup>
          <Tandem
            leftMax={50}
            left={<Label children="Order" />}
            right={
              <Tandem
                leftMax={50}
                left={<UnitInput options={['int']} unit$={order$} />}
                right={
                  <ButtonGroup>
                    <Button
                      isActive={preset === EPreset.First}
                      onClick={setPreset(EPreset.First)}
                      children="First"
                    />
                    <Button
                      isActive={preset === EPreset.Last}
                      onClick={setPreset(EPreset.Last)}
                      children="Last"
                    />
                  </ButtonGroup>
                }
              />
            }
          />
        </TandemGroup>
      )}
    </>
  );
});

const lensPreset = Lens.create<IElementFlexChildProps, EPreset>(
  (props) => {
    const order = props.order.n;
    return order === 1 ? EPreset.First : order === -1 ? EPreset.Last : EPreset.Custom;
  },
  (newValue, state) => {
    if (newValue === EPreset.Custom) {
      return state;
    } else {
      return {
        ...state,
        order: unitOptions.int.stringToUnit(newValue === EPreset.First ? '1' : '-1'),
      };
    }
  }
);
