import React from 'react';

import { Atom, Lens } from '@grammarly/focal';

import { Label } from '../../../../generic/components/Label';
import { Switcher } from '../../../../generic/components/Switcher';
import { Tandem } from '../../../../generic/components/Tandem';
import {
    IElementFlexProps, IElementGeneric, lensElementFlexProps,
} from '../../../../generic/states/elements';
import { flexIsReversed, TFlexDirection } from '../../../../generic/style-helpers/flex';

interface IProps {
  element$: Atom<IElementGeneric>;
}

export const Reverse = React.memo<IProps>(({ element$ }) => {
  const { isReversed$ } = React.useMemo(() => {
    return {
      isReversed$: element$.lens(lensElementFlexProps).lens(lensIsReversed),
    };
  }, [element$]);
  return (
    <Tandem
      middle={50}
      left={<Label children="Reverse" />}
      right={<Switcher value$={isReversed$} />}
    />
  );
});

const lensIsReversed = Lens.create<IElementFlexProps, boolean>(
  ({ flexDirection }) => flexIsReversed(flexDirection),
  (newValue, state) => {
    const direction = state.flexDirection;
    const nextDirection = (newValue
      ? `${direction}-reverse`
      : direction.replace('-reverse', '')) as TFlexDirection;
    return { ...state, flexDirection: nextDirection };
  }
);
