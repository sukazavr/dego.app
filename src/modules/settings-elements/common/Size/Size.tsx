import React from 'react';

import { Atom } from '@grammarly/focal';

import { Label } from '../../../../generic/components/Label';
import { Panel } from '../../../../generic/components/Panel';
import { Stack } from '../../../../generic/components/Stack';
import { Tandem } from '../../../../generic/components/Tandem';
import { TandemGroup } from '../../../../generic/components/TandemGroup';
import { IElementGeneric, lensElementFlexProps } from '../../../../generic/states/elements';
import { TUnitOptionsKeys } from '../../../unit-input/options';
import { UnitInput } from '../../../unit-input/UnitInput';

interface IProps {
  element$: Atom<IElementGeneric>;
}

export const Size = React.memo<IProps>(({ element$ }) => {
  const { width$, height$, options } = React.useMemo(() => {
    const flexProps$ = element$.lens(lensElementFlexProps);
    return {
      options: [
        'auto',
        'px',
        'em',
        'rem',
        'vw',
        'vh',
        '%',
        'min-content',
        'max-content',
        'inherit',
      ] as TUnitOptionsKeys[],
      width$: flexProps$.lens('width'),
      height$: flexProps$.lens('height'),
    };
  }, [element$]);
  return (
    <>
      <Panel title="Size" />
      <TandemGroup>
        <Tandem
          left={
            <Stack spacing={1} isInline isCentered>
              <Label children="W" />
              <UnitInput options={options} unit$={width$} />
            </Stack>
          }
          right={
            <Stack spacing={1} isInline isCentered>
              <Label children="H" />
              <UnitInput options={options} unit$={height$} />
            </Stack>
          }
        />
      </TandemGroup>
    </>
  );
});
