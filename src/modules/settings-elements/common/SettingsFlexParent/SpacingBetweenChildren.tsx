import React from 'react';

import { Atom } from '@grammarly/focal';

import { Label } from '../../../../generic/components/Label';
import { Tandem } from '../../../../generic/components/Tandem';
import { IElementFlexParentProps } from '../../../../generic/states/elements';
import { UnitInput } from '../../../unit-input/UnitInput';

interface IProps {
  flexParentProps$: Atom<IElementFlexParentProps>;
}

export const SpacingBetweenChildren = React.memo<IProps>(({ flexParentProps$ }) => {
  const { spacingBetweenChildren$ } = React.useMemo(() => {
    return {
      spacingBetweenChildren$: flexParentProps$.lens('spacingBetweenChildren'),
    };
  }, [flexParentProps$]);
  return (
    <Tandem
      left={<Label children="Spacing Between Children" />}
      leftMax={150}
      leader="left"
      right={<UnitInput options={['px', 'em', 'rem', '%']} unit$={spacingBetweenChildren$} />}
      rightAlign="flex-end"
    />
  );
});
