import React from 'react';

import { Atom } from '@grammarly/focal';

import { Label } from '../../../../generic/components/Label';
import { Stack } from '../../../../generic/components/Stack';
import { Tandem } from '../../../../generic/components/Tandem';
import { IGenericPropsSpacing } from '../../../../generic/states/elements';
import { TooltipProvider } from '../../../tooltip/TooltipProvider';
import { TUnitOptionsKeys } from '../../../unit-input/options';
import { UnitInput } from '../../../unit-input/UnitInput';

interface IProps {
  title: string;
  spacing$: Atom<IGenericPropsSpacing>;
}

export const Spacing = React.memo<IProps>(({ title, spacing$ }) => {
  const { left$, top$, right$, bottom$, options } = React.useMemo(() => {
    return {
      options: ['auto', 'px', 'em', 'rem', 'vw', 'vh', '%', 'inherit'] as TUnitOptionsKeys[],
      left$: spacing$.lens('left'),
      top$: spacing$.lens('top'),
      right$: spacing$.lens('right'),
      bottom$: spacing$.lens('bottom'),
    };
  }, [spacing$]);
  return (
    <>
      <TooltipProvider />
      <Tandem
        left={<Label children={title} data-tip="top, right, bottom, left" />}
        leftMax={50}
        right={
          <Stack isInline spacing={1}>
            <UnitInput options={options} unit$={top$} />
            <UnitInput options={options} unit$={right$} />
            <UnitInput options={options} unit$={bottom$} />
            <UnitInput options={options} unit$={left$} />
          </Stack>
        }
      />
    </>
  );
});
