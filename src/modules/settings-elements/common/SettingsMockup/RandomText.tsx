import React from 'react';

import { Atom } from '@grammarly/focal';

import { Label } from '../../../../generic/components/Label';
import { Panel } from '../../../../generic/components/Panel';
import { Switcher } from '../../../../generic/components/Switcher';
import { Tandem } from '../../../../generic/components/Tandem';
import { TandemGroup } from '../../../../generic/components/TandemGroup';
import { IElementMockupProps } from '../../../../generic/states/elements';
import { useObservable } from '../../../../generic/supply/react-helpers';
import { UnitInput } from '../../../unit-input/UnitInput';

interface IProps {
  mockupProps$: Atom<IElementMockupProps>;
}

export const RandomText = React.memo<IProps>(({ mockupProps$ }) => {
  const { hasRandomText$, randomTextLength$ } = React.useMemo(() => {
    return {
      hasRandomText$: mockupProps$.lens('hasRandomText'),
      randomTextLength$: mockupProps$.lens('randomTextLength'),
    };
  }, [mockupProps$]);
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
            leader="left"
            right={<UnitInput options={['int']} unit$={randomTextLength$} />}
            rightAlign="flex-end"
          />
        </TandemGroup>
      )}
    </>
  );
});
