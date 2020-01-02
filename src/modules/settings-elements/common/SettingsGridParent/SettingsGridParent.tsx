import React from 'react';

import { Atom, ReadOnlyAtom } from '@grammarly/focal';

import { Alert } from '../../../../generic/components/Alert';
import { Panel } from '../../../../generic/components/Panel';
import { IElementGeneric } from '../../../../generic/states/elements';

interface IProps {
  element$: Atom<IElementGeneric>;
  parent$: ReadOnlyAtom<IElementGeneric>;
}

export const SettingsGridParent = React.memo<IProps>(({ element$, parent$ }) => {
  return (
    <>
      <Panel title="Grid Parent" />
      <Alert icon="info" text="Not yet implemented" />
    </>
  );
});
