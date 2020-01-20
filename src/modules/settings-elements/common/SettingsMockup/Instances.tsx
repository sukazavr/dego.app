import React from 'react';

import { Atom } from '@grammarly/focal';

import { Label } from '../../../../generic/components/Label';
import { Tandem } from '../../../../generic/components/Tandem';
import { IElementMockupProps } from '../../../../generic/states/elements';
import { UnitInput } from '../../../unit-input/UnitInput';

interface IProps {
  mockupProps$: Atom<IElementMockupProps>;
}

export const Instances = React.memo<IProps>(({ mockupProps$ }) => {
  const { instances$ } = React.useMemo(() => {
    return {
      instances$: mockupProps$.lens('instances'),
    };
  }, [mockupProps$]);
  return (
    <Tandem
      left={<Label children="Instances" />}
      leftMax={150}
      leader="left"
      right={<UnitInput options={['int']} unit$={instances$} />}
      rightAlign="flex-end"
    />
  );
});
