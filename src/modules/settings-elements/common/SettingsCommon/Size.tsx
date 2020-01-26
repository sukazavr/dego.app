import React from 'react';

import { Atom } from '@grammarly/focal';

import { Label } from '../../../../generic/components/Label';
import { Panel } from '../../../../generic/components/Panel';
import { Tandem } from '../../../../generic/components/Tandem';
import { TandemGroup } from '../../../../generic/components/TandemGroup';
import { IElementCommonProps } from '../../../../generic/states/elements';
import { TUnitOptionsKeys } from '../../../unit-input/options';
import { UnitInput } from '../../../unit-input/UnitInput';

interface IProps {
  commonProps$: Atom<IElementCommonProps>;
}

export const Size = React.memo<IProps>(({ commonProps$ }) => {
  const {
    width$,
    height$,
    minWidth$,
    minHeight$,
    maxWidth$,
    maxHeight$,
    options,
  } = React.useMemo(() => {
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
      minWidth$: commonProps$.lens('minWidth'),
      minHeight$: commonProps$.lens('minHeight'),
      maxWidth$: commonProps$.lens('maxWidth'),
      maxHeight$: commonProps$.lens('maxHeight'),
    };
  }, [commonProps$]);
  return (
    <>
      <Panel title="Size" />
      <TandemGroup>
        <Tandem
          left={
            <Tandem
              left={<Label children="Width" />}
              right={<UnitInput options={options} unit$={width$} />}
              leftMax={46}
            />
          }
          right={
            <Tandem
              left={<Label children="Height" />}
              right={<UnitInput options={options} unit$={height$} />}
              leftMax={46}
            />
          }
        />
        <Tandem
          left={
            <Tandem
              left={<Label children="Min W" />}
              right={<UnitInput options={options} unit$={minWidth$} />}
              leftMax={46}
            />
          }
          right={
            <Tandem
              left={<Label children="Min H" />}
              right={<UnitInput options={options} unit$={minHeight$} />}
              leftMax={46}
            />
          }
        />
        <Tandem
          left={
            <Tandem
              left={<Label children="Max W" />}
              right={<UnitInput options={options} unit$={maxWidth$} />}
              leftMax={46}
            />
          }
          right={
            <Tandem
              left={<Label children="Max H" />}
              right={<UnitInput options={options} unit$={maxHeight$} />}
              leftMax={46}
            />
          }
        />
      </TandemGroup>
    </>
  );
});
