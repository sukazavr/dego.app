import React from 'react';

import { Atom, ReadOnlyAtom } from '@grammarly/focal';

import { Panel } from '../../../../generic/components/Panel';
import { IElementGeneric } from '../../../../generic/states/elements';

interface IProps {
  element$: Atom<IElementGeneric>;
  parent$: ReadOnlyAtom<IElementGeneric>;
}

export const SettingsFlexParent = React.memo<IProps>(({ element$, parent$ }) => {
  return (
    <>
      <Panel title="Flex Parent" />
    </>
  );
});
