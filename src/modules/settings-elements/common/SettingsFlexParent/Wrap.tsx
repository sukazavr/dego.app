import React from 'react';

import { Atom, Lens } from '@grammarly/focal';

import { Button } from '../../../../generic/components/Button';
import { ButtonGroup } from '../../../../generic/components/ButtonGroup';
import { Label } from '../../../../generic/components/Label';
import { Panel } from '../../../../generic/components/Panel';
import { Switcher } from '../../../../generic/components/Switcher';
import { Tandem } from '../../../../generic/components/Tandem';
import { TandemGroup } from '../../../../generic/components/TandemGroup';
import {
    IElementFlexProps, IElementGeneric, lensElementFlexProps,
} from '../../../../generic/states/elements';
import { useObservable } from '../../../../generic/supply/react-helpers';
import { projectionFlexIsRow } from '../types';

interface IProps {
  element$: Atom<IElementGeneric>;
}

export const Wrap = React.memo<IProps>(({ element$ }) => {
  const { isRow$, preset$, setPreset, isActive$, isReversed$ } = React.useMemo(() => {
    const flexProps$ = element$.lens(lensElementFlexProps);
    const memoPreset$ = flexProps$.lens('alignContent');
    return {
      isRow$: flexProps$.view(projectionFlexIsRow),
      preset$: memoPreset$,
      setPreset: (preset: IElementFlexProps['alignContent']) => () => memoPreset$.set(preset),
      isActive$: flexProps$.lens(lensIsActive),
      isReversed$: flexProps$.lens(lensIsReversed),
    };
  }, [element$]);
  const preset = useObservable(preset$);
  const isRow = useObservable(isRow$);
  const isActive = useObservable(isActive$);
  const isReversed = useObservable(isReversed$);
  const iconFlip = isReversed ? (isRow ? 2 : 1) : undefined;
  return (
    <>
      <Panel title="Wrap" isTransparent>
        <Switcher value$={isActive$} />
      </Panel>
      {isActive && (
        <TandemGroup>
          <Tandem
            leftMax={50}
            left={<Label children="Align" />}
            right={
              <ButtonGroup>
                <Button
                  icon="gridBottom"
                  iconFlip={iconFlip}
                  iconRotate={isRow ? 2 : 1}
                  isActive={preset === 'flex-start'}
                  onClick={setPreset('flex-start')}
                />
                <Button
                  icon="gridCenter"
                  iconFlip={iconFlip}
                  iconRotate={isRow ? undefined : 1}
                  isActive={preset === 'center'}
                  onClick={setPreset('center')}
                />
                <Button
                  icon="gridBottom"
                  iconFlip={iconFlip}
                  iconRotate={isRow ? undefined : 3}
                  isActive={preset === 'flex-end'}
                  onClick={setPreset('flex-end')}
                />
                <Button
                  icon="gridStretch"
                  iconFlip={iconFlip}
                  iconRotate={isRow ? undefined : 1}
                  isActive={preset === 'stretch'}
                  onClick={setPreset('stretch')}
                />
                <Button
                  icon="gridBetween"
                  iconFlip={iconFlip}
                  iconRotate={isRow ? undefined : 1}
                  isActive={preset === 'space-between'}
                  onClick={setPreset('space-between')}
                />
                <Button
                  icon="gridAround"
                  iconFlip={iconFlip}
                  iconRotate={isRow ? undefined : 1}
                  isActive={preset === 'space-around'}
                  onClick={setPreset('space-around')}
                />
              </ButtonGroup>
            }
          />
          <Tandem
            leftMax={50}
            left={<Label children="Reverse" />}
            right={<Switcher value$={isReversed$} />}
          />
        </TandemGroup>
      )}
    </>
  );
});

const lensIsActive = Lens.create<IElementFlexProps, boolean>(
  (props) => props.flexWrap !== 'nowrap',
  (newValue, state) => {
    return {
      ...state,
      flexWrap: newValue ? 'wrap' : 'nowrap',
    };
  }
);

const lensIsReversed = Lens.create<IElementFlexProps, boolean>(
  ({ flexWrap }) => flexWrap.includes('reverse'),
  (newValue, state) => ({ ...state, flexWrap: newValue ? 'wrap-reverse' : 'wrap' })
);
