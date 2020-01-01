import React from 'react';

import { Atom } from '@grammarly/focal';

import { Button } from '../../../../generic/components/Button';
import { ButtonGroup } from '../../../../generic/components/ButtonGroup';
import { Label } from '../../../../generic/components/Label';
import { Tandem } from '../../../../generic/components/Tandem';
import {
    IElementFlexProps, IElementGeneric, lensElementFlexProps,
} from '../../../../generic/states/elements';
import { useObservable } from '../../../../generic/supply/react-helpers';
import { projectionFlexIsRow } from '../types';

interface IProps {
  element$: Atom<IElementGeneric>;
}

export const Justify = React.memo<IProps>(({ element$ }) => {
  const { isRow$, preset$, setPreset } = React.useMemo(() => {
    const flexProps$ = element$.lens(lensElementFlexProps);
    const memoPreset$ = flexProps$.lens('justifyContent');
    return {
      isRow$: flexProps$.view(projectionFlexIsRow),
      preset$: memoPreset$,
      setPreset: (preset: IElementFlexProps['justifyContent']) => () => memoPreset$.set(preset),
    };
  }, [element$]);
  const preset = useObservable(preset$);
  const isRow = useObservable(isRow$);
  return (
    <Tandem
      middle={50}
      left={<Label children="Justify" />}
      right={
        <ButtonGroup>
          <Button
            icon="stackBottom"
            iconRotate={isRow ? 1 : 2}
            isActive={preset === 'flex-start'}
            onClick={setPreset('flex-start')}
          />
          <Button
            icon="stackCenter"
            iconRotate={isRow ? 1 : undefined}
            isActive={preset === 'center'}
            onClick={setPreset('center')}
          />
          <Button
            icon="stackBottom"
            iconRotate={isRow ? 3 : undefined}
            isActive={preset === 'flex-end'}
            onClick={setPreset('flex-end')}
          />
          <Button
            icon="stackBetween"
            iconRotate={isRow ? 1 : undefined}
            isActive={preset === 'space-between'}
            onClick={setPreset('space-between')}
          />
          <Button
            icon="stackAround"
            iconRotate={isRow ? 1 : undefined}
            isActive={preset === 'space-around'}
            onClick={setPreset('space-around')}
          />
        </ButtonGroup>
      }
    />
  );
});
