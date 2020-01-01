import React from 'react';

import { Atom } from '@grammarly/focal';

import { Button } from '../../../../generic/components/Button';
import { ButtonGroup } from '../../../../generic/components/ButtonGroup';
import { Label } from '../../../../generic/components/Label';
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

export const Align = React.memo<IProps>(({ element$ }) => {
  const { isRow$, preset$, setPreset } = React.useMemo(() => {
    const flexProps$ = element$.lens(lensElementFlexProps);
    const memoPreset$ = flexProps$.lens('alignItems');
    return {
      isRow$: flexProps$.view(projectionFlexIsRow),
      preset$: memoPreset$,
      setPreset: (preset: IElementFlexProps['alignItems']) => () => memoPreset$.set(preset),
    };
  }, [element$]);
  const preset = useObservable(preset$);
  const isRow = useObservable(isRow$);
  return (
    <TandemGroup>
      <Tandem
        middle={50}
        left={<Label children="Align" />}
        right={
          <ButtonGroup>
            <Button
              icon="twoBottom"
              iconRotate={isRow ? 2 : 1}
              isActive={preset === 'flex-start'}
              onClick={setPreset('flex-start')}
            />
            <Button
              icon="twoCenter"
              iconRotate={isRow ? undefined : 1}
              isActive={preset === 'center'}
              onClick={setPreset('center')}
            />
            <Button
              icon="twoBottom"
              iconRotate={isRow ? undefined : 3}
              isActive={preset === 'flex-end'}
              onClick={setPreset('flex-end')}
            />
            <Button
              icon="twoStretch"
              iconRotate={isRow ? undefined : 1}
              isActive={preset === 'stretch'}
              onClick={setPreset('stretch')}
            />
            <Button
              icon="twoBaseline"
              iconRotate={isRow ? undefined : 1}
              isActive={preset === 'baseline'}
              onClick={setPreset('baseline')}
            />
          </ButtonGroup>
        }
      />
    </TandemGroup>
  );
});
