import React from 'react';

import { Atom, Lens } from '@grammarly/focal';

import { Label } from '../../../../generic/components/Label';
import { Switcher } from '../../../../generic/components/Switcher';
import { Tandem } from '../../../../generic/components/Tandem';
import { IElementFlexParentProps } from '../../../../generic/states/elements';
import { flexIsReversed, TFlexDirection } from '../../../../generic/style-helpers/flex';

interface IProps {
  flexParentProps$: Atom<IElementFlexParentProps>;
}

export const Reverse = React.memo<IProps>(({ flexParentProps$ }) => {
  const { isReversed$ } = React.useMemo(() => {
    return {
      isReversed$: flexParentProps$.lens(lensIsReversed),
    };
  }, [flexParentProps$]);
  return (
    <Tandem
      leftMax={50}
      left={<Label children="Reverse" />}
      right={<Switcher value$={isReversed$} />}
    />
  );
});

const lensIsReversed = Lens.create<IElementFlexParentProps, boolean>(
  ({ flexDirection }) => flexIsReversed(flexDirection),
  (newValue, state) => {
    const direction = state.flexDirection;
    const nextDirection = (newValue
      ? `${direction}-reverse`
      : direction.replace('-reverse', '')) as TFlexDirection;
    return { ...state, flexDirection: nextDirection };
  }
);
