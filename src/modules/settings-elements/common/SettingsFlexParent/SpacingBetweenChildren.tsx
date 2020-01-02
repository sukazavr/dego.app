import React from 'react';

import { Atom } from '@grammarly/focal';

import { Label } from '../../../../generic/components/Label';
import { Tandem } from '../../../../generic/components/Tandem';
import { IElementGeneric, lensElementFlexProps } from '../../../../generic/states/elements';
import { UnitInput } from '../../../unit-input/UnitInput';

interface IProps {
  element$: Atom<IElementGeneric>;
}

export const SpacingBetweenChildren = React.memo<IProps>(({ element$ }) => {
  const { spacingBetweenChildren$ } = React.useMemo(() => {
    const flexProps$ = element$.lens(lensElementFlexProps);
    return {
      spacingBetweenChildren$: flexProps$.lens('spacingBetweenChildren'),
    };
  }, [element$]);
  return (
    <Tandem
      left={<Label children="Spacing Between Children" />}
      leftMax={150}
      leftLoose
      right={<UnitInput options={['px', 'em', 'rem', '%']} unit$={spacingBetweenChildren$} />}
      rightAlign="flex-end"
    />
  );
});
