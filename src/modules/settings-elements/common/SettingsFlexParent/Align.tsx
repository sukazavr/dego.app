import React from 'react';

import { Atom } from '@grammarly/focal';

import { Button } from '../../../../generic/components/Button';
import { ButtonGroup } from '../../../../generic/components/ButtonGroup';
import { Label } from '../../../../generic/components/Label';
import { Tandem } from '../../../../generic/components/Tandem';
import {
    IElementFlexProps, IElementGeneric, lensElementFlexProps,
} from '../../../../generic/states/elements';
import { flexIsReversed } from '../../../../generic/style-helpers/flex';
import { useObservable } from '../../../../generic/supply/react-helpers';
import { projectionFlexIsRow } from '../types';

interface IProps {
  element$: Atom<IElementGeneric>;
}

export const Align = React.memo<IProps>(({ element$ }) => {
  const { isRow$, isReversed$, preset$, setPreset } = React.useMemo(() => {
    const flexProps$ = element$.lens(lensElementFlexProps);
    const memoPreset$ = flexProps$.lens('alignItems');
    return {
      isRow$: flexProps$.view(projectionFlexIsRow),
      isReversed$: flexProps$.view((props) => flexIsReversed(props.flexDirection)),
      preset$: memoPreset$,
      setPreset: (preset: IElementFlexProps['alignItems']) => () => memoPreset$.set(preset),
    };
  }, [element$]);
  const preset = useObservable(preset$);
  const isRow = useObservable(isRow$);
  const isReversed = useObservable(isReversed$);
  const iconFlip = isReversed ? (isRow ? 1 : 2) : undefined;
  return (
    <Tandem
      leftMax={50}
      left={<Label children="Align" />}
      right={
        <ButtonGroup>
          <Button
            icon="twoBottom"
            iconRotate={isRow ? 2 : 1}
            iconFlip={iconFlip}
            isActive={preset === 'flex-start'}
            onClick={setPreset('flex-start')}
          />
          <Button
            icon="twoCenter"
            iconRotate={isRow ? undefined : 1}
            iconFlip={iconFlip}
            isActive={preset === 'center'}
            onClick={setPreset('center')}
          />
          <Button
            icon="twoBottom"
            iconRotate={isRow ? undefined : 3}
            iconFlip={iconFlip}
            isActive={preset === 'flex-end'}
            onClick={setPreset('flex-end')}
          />
          <Button
            icon="twoStretch"
            iconRotate={isRow ? undefined : 1}
            iconFlip={iconFlip}
            isActive={preset === 'stretch'}
            onClick={setPreset('stretch')}
          />
          <Button
            icon="twoBaseline"
            iconRotate={isRow ? undefined : 1}
            iconFlip={iconFlip}
            isActive={preset === 'baseline'}
            onClick={setPreset('baseline')}
          />
        </ButtonGroup>
      }
    />
  );
});
