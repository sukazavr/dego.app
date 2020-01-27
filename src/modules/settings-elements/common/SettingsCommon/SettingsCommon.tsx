import React from 'react';

import { Atom } from '@grammarly/focal';

import { Panel } from '../../../../generic/components/Panel';
import { TandemGroup } from '../../../../generic/components/TandemGroup';
import { IElementCommonProps } from '../../../../generic/states/elements';
import { Size } from './Size';
import { Spacing } from './Spacing';

interface IProps {
  commonProps$: Atom<IElementCommonProps>;
}

export const SettingsCommon = React.memo<IProps>(({ commonProps$ }) => {
  const props = React.useMemo(
    () => ({
      padding$: commonProps$.lens('padding'),
      margin$: commonProps$.lens('margin'),
    }),
    [commonProps$]
  );
  return (
    <>
      <Size commonProps$={commonProps$} />
      <Panel title="Spacing" />
      <TandemGroup>
        <Spacing spacing$={props.padding$} title="Padding" />
        <Spacing spacing$={props.margin$} title="Margin" />
      </TandemGroup>
    </>
  );
});
