import React from 'react';

import { Atom } from '@grammarly/focal';

import { Label } from '../../../../generic/components/Label';
import { Panel } from '../../../../generic/components/Panel';
import { Switcher } from '../../../../generic/components/Switcher';
import { Tandem } from '../../../../generic/components/Tandem';
import { TandemGroup } from '../../../../generic/components/TandemGroup';
import { IElementComponentProps } from '../../../../generic/states/elements';
import { useObservable } from '../../../../generic/supply/react-helpers';
import { UnitInput } from '../../../unit-input/UnitInput';

interface IProps {
  componentProps$: Atom<IElementComponentProps>;
}

export const RandomText = React.memo<IProps>(({ componentProps$ }) => {
  const { hasRandomText$, randomTextLength$ } = React.useMemo(() => {
    return {
      hasRandomText$: componentProps$.lens('hasRandomText'),
      randomTextLength$: componentProps$.lens('randomTextLength'),
    };
  }, [componentProps$]);
  const hasRandomText = useObservable(hasRandomText$);
  return (
    <>
      <Panel title="Random Text" isTransparent>
        <Switcher value$={hasRandomText$} />
      </Panel>
      {hasRandomText && (
        <TandemGroup>
          <Tandem
            left={<Label children="Text Length" />}
            leftMax={150}
            leftLoose
            right={<UnitInput options={['int']} unit$={randomTextLength$} />}
            rightAlign="flex-end"
          />
        </TandemGroup>
      )}
    </>
  );
});
