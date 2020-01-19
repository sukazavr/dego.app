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

export const Justify = React.memo<IProps>(({ flexParentProps$ }) => {
  const { isRow$, isReversed$, preset$, setPreset } = React.useMemo(() => {
    const memoPreset$ = flexParentProps$.lens('justifyContent');
    return {
      isRow$: flexParentProps$.view(projectionFlexIsRow),
      isReversed$: flexParentProps$.view((props) => flexDirectionIsReversed(props.flexDirection)),
      preset$: memoPreset$,
      setPreset: (preset: IElementFlexParentProps['justifyContent']) => () =>
        memoPreset$.set(preset),
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
        left={<Label children="Justify" />}
        right={
          <ButtonGroup>
            <Button
              icon="stackBottom"
              iconRotate={isRow ? 1 : 2}
              iconFlip={iconFlip}
              isActive={preset === 'flex-start'}
              onClick={setPreset('flex-start')}
              data-tip="flex-start"
            />
            <Button
              icon="stackCenter"
              iconRotate={isRow ? 1 : undefined}
              iconFlip={iconFlip}
              isActive={preset === 'center'}
              onClick={setPreset('center')}
              data-tip="center"
            />
            <Button
              icon="stackBottom"
              iconRotate={isRow ? 3 : undefined}
              iconFlip={iconFlip}
              isActive={preset === 'flex-end'}
              onClick={setPreset('flex-end')}
              data-tip="flex-end"
            />
            <Button
              icon="stackBetween"
              iconRotate={isRow ? 1 : undefined}
              iconFlip={iconFlip}
              isActive={preset === 'space-between'}
              onClick={setPreset('space-between')}
              data-tip="space-between"
            />
            <Button
              icon="stackAround"
              iconRotate={isRow ? 1 : undefined}
              iconFlip={iconFlip}
              isActive={preset === 'space-around'}
              onClick={setPreset('space-around')}
              data-tip="space-around"
            />
          </ButtonGroup>
        }
      />
    </>
  );
});
