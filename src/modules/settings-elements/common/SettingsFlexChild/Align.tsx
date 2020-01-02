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
    IElementFlexProps, IElementGeneric, lensElementFlexProps,
} from '../../../../generic/states/elements';
import { useObservable } from '../../../../generic/supply/react-helpers';
import { projectionFlexIsRow } from '../types';

interface IProps {
  element$: Atom<IElementGeneric>;
  parent$: ReadOnlyAtom<IElementGeneric>;
}

export const Align = React.memo<IProps>(({ element$, parent$ }) => {
  const { isParentRow$, preset$, setPreset, isAlignOverridden$ } = React.useMemo(() => {
    const flexProps$ = element$.lens(lensElementFlexProps);
    const memoPreset$ = flexProps$.lens('alignSelf');
    return {
      isParentRow$: parent$.view(lensElementFlexProps).view(projectionFlexIsRow),
      preset$: memoPreset$,
      setPreset: (preset: IElementFlexProps['alignSelf']) => () => memoPreset$.set(preset),
      isAlignOverridden$: flexProps$.lens('isAlignOverridden'),
    };
  }, [element$, parent$]);
  const preset = useObservable(preset$);
  const isParentRow = useObservable(isParentRow$);
  const isAlignOverridden = useObservable(isAlignOverridden$);
  return (
    <>
      <Panel title="Override Align" isTransparent>
        <Switcher value$={isAlignOverridden$} />
      </Panel>
      {isAlignOverridden && (
        <TandemGroup>
          <Tandem
            middle={50}
            left={<Label children="Align" />}
            right={
              <ButtonGroup>
                <Button
                  icon="oneBottom"
                  iconRotate={isParentRow ? undefined : 1}
                  isActive={preset === 'flex-start'}
                  onClick={setPreset('flex-start')}
                />
                <Button
                  icon="oneCenter"
                  iconRotate={isParentRow ? undefined : 1}
                  isActive={preset === 'center'}
                  onClick={setPreset('center')}
                />
                <Button
                  icon="oneBottom"
                  iconRotate={isParentRow ? 2 : 3}
                  isActive={preset === 'flex-end'}
                  onClick={setPreset('flex-end')}
                />
                <Button
                  icon="oneStretch"
                  iconRotate={isParentRow ? undefined : 1}
                  isActive={preset === 'stretch'}
                  onClick={setPreset('stretch')}
                />
                <Button
                  icon="oneBaseline"
                  iconRotate={isParentRow ? undefined : 1}
                  isActive={preset === 'baseline'}
                  onClick={setPreset('baseline')}
                />
              </ButtonGroup>
            }
          />
        </TandemGroup>
      )}
    </>
  );
});