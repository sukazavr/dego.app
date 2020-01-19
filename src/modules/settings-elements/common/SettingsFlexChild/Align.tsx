import React from 'react';

import { Atom, ReadOnlyAtom } from '@grammarly/focal';

import { Button } from '../../../../generic/components/Button';
import { ButtonGroup } from '../../../../generic/components/ButtonGroup';
import { Label } from '../../../../generic/components/Label';
import { Panel } from '../../../../generic/components/Panel';
import { Switcher } from '../../../../generic/components/Switcher';
import { Tandem } from '../../../../generic/components/Tandem';
import { TandemGroup } from '../../../../generic/components/TandemGroup';
import {
    IElementFlexChildProps, IElementFlexParentProps,
} from '../../../../generic/states/elements';
import { useObservable } from '../../../../generic/supply/react-helpers';
import { TooltipProvider } from '../../../tooltip/TooltipProvider';
import { projectionFlexIsRow } from '../types';

interface IProps {
  flexChildProps$: Atom<IElementFlexChildProps>;
  parentFlexParentProps$: ReadOnlyAtom<IElementFlexParentProps>;
}

export const Align = React.memo<IProps>(({ flexChildProps$, parentFlexParentProps$ }) => {
  const { isParentRow$, preset$, setPreset, isAlignOverridden$ } = React.useMemo(() => {
    const memoPreset$ = flexChildProps$.lens('alignSelf');
    return {
      isParentRow$: parentFlexParentProps$.view(projectionFlexIsRow),
      preset$: memoPreset$,
      setPreset: (preset: IElementFlexChildProps['alignSelf']) => () => memoPreset$.set(preset),
      isAlignOverridden$: flexChildProps$.lens('isAlignOverridden'),
    };
  }, [flexChildProps$, parentFlexParentProps$]);
  const preset = useObservable(preset$);
  const isParentRow = useObservable(isParentRow$);
  const isAlignOverridden = useObservable(isAlignOverridden$);
  return (
    <>
      <TooltipProvider />
      <Panel title="Override Align" isTransparent>
        <Switcher value$={isAlignOverridden$} />
      </Panel>
      {isAlignOverridden && (
        <TandemGroup>
          <Tandem
            leftMax={50}
            left={<Label children="Align" />}
            right={
              <ButtonGroup>
                <Button
                  icon="oneBottom"
                  iconRotate={isParentRow ? undefined : 1}
                  isActive={preset === 'flex-start'}
                  onClick={setPreset('flex-start')}
                  data-tip="flex-start"
                />
                <Button
                  icon="oneCenter"
                  iconRotate={isParentRow ? undefined : 1}
                  isActive={preset === 'center'}
                  onClick={setPreset('center')}
                  data-tip="center"
                />
                <Button
                  icon="oneBottom"
                  iconRotate={isParentRow ? 2 : 3}
                  isActive={preset === 'flex-end'}
                  onClick={setPreset('flex-end')}
                  data-tip="flex-end"
                />
                <Button
                  icon="oneStretch"
                  iconRotate={isParentRow ? undefined : 1}
                  isActive={preset === 'stretch'}
                  onClick={setPreset('stretch')}
                  data-tip="stretch"
                />
                <Button
                  icon="oneBaseline"
                  iconRotate={isParentRow ? undefined : 1}
                  isActive={preset === 'baseline'}
                  onClick={setPreset('baseline')}
                  data-tip="baseline"
                />
              </ButtonGroup>
            }
          />
        </TandemGroup>
      )}
    </>
  );
});
