import React from 'react';

import { Atom } from '@grammarly/focal';

import { Button } from '../../../../generic/components/Button';
import { ButtonGroup } from '../../../../generic/components/ButtonGroup';
import { Label } from '../../../../generic/components/Label';
import { Tandem } from '../../../../generic/components/Tandem';
import { IElementFlexParentProps } from '../../../../generic/states/elements';
import { flexDirectionIsReversed } from '../../../../generic/style-helpers/flex';
import { useObservable } from '../../../../generic/supply/react-helpers';
import { TooltipProvider } from '../../../tooltip/TooltipProvider';
import { projectionFlexIsRow } from '../types';

interface IProps {
  flexParentProps$: Atom<IElementFlexParentProps>;
}

export const Align = React.memo<IProps>(({ flexParentProps$ }) => {
  const { isRow$, isReversed$, preset$, setPreset } = React.useMemo(() => {
    const memoPreset$ = flexParentProps$.lens('alignItems');
    return {
      isRow$: flexParentProps$.view(projectionFlexIsRow),
      isReversed$: flexParentProps$.view((props) => flexDirectionIsReversed(props.flexDirection)),
      preset$: memoPreset$,
      setPreset: (preset: IElementFlexParentProps['alignItems']) => () => memoPreset$.set(preset),
    };
  }, [flexParentProps$]);
  const preset = useObservable(preset$);
  const isRow = useObservable(isRow$);
  const isReversed = useObservable(isReversed$);
  const iconFlip = isReversed ? (isRow ? 1 : 2) : undefined;
  return (
    <>
      <TooltipProvider />
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
              data-tip="flex-start"
            />
            <Button
              icon="twoCenter"
              iconRotate={isRow ? undefined : 1}
              iconFlip={iconFlip}
              isActive={preset === 'center'}
              onClick={setPreset('center')}
              data-tip="center"
            />
            <Button
              icon="twoBottom"
              iconRotate={isRow ? undefined : 3}
              iconFlip={iconFlip}
              isActive={preset === 'flex-end'}
              onClick={setPreset('flex-end')}
              data-tip="flex-end"
            />
            <Button
              icon="twoStretch"
              iconRotate={isRow ? undefined : 1}
              iconFlip={iconFlip}
              isActive={preset === 'stretch'}
              onClick={setPreset('stretch')}
              data-tip="stretch"
            />
            <Button
              icon="twoBaseline"
              iconRotate={isRow ? undefined : 1}
              iconFlip={iconFlip}
              isActive={preset === 'baseline'}
              onClick={setPreset('baseline')}
              data-tip="baseline"
            />
          </ButtonGroup>
        }
      />
    </>
  );
});
