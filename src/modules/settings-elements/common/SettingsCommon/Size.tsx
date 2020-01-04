import React from 'react';

import { Atom } from '@grammarly/focal';

import { Label } from '../../../../generic/components/Label';
import { Panel } from '../../../../generic/components/Panel';
import { Stack } from '../../../../generic/components/Stack';
import { Tandem } from '../../../../generic/components/Tandem';
import { TandemGroup } from '../../../../generic/components/TandemGroup';
import { IElementCommonProps } from '../../../../generic/states/elements';
import { TUnitOptionsKeys } from '../../../unit-input/options';
import { UnitInput } from '../../../unit-input/UnitInput';

interface IProps {
  commonProps$: Atom<IElementCommonProps>;
}

export const Size = React.memo<IProps>(({ commonProps$ }) => {
  const { width$, height$, options } = React.useMemo(() => {
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
      width$: commonProps$.lens('width'),
      height$: commonProps$.lens('height'),
    };
  }, [commonProps$]);
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