import React from 'react';

import { Atom, ReadOnlyAtom } from '@grammarly/focal';

import { Panel } from '../../../../generic/components/Panel';
import { TandemGroup } from '../../../../generic/components/TandemGroup';
import { IElementGeneric } from '../../../../generic/states/elements';
import { Align } from './Align';
import { Justify } from './Justify';
import { Reverse } from './Reverse';
import { SpacingBetweenChildren } from './SpacingBetweenChildren';
import { Wrap } from './Wrap';

interface IProps {
  element$: Atom<IElementGeneric>;
  parent$: ReadOnlyAtom<IElementGeneric>;
}

export const SettingsFlexParent = React.memo<IProps>(({ element$, parent$ }) => {
  return (
    <>
      <Panel title="Flex Parent" />
      <TandemGroup>
        <Align element$={element$} />
        <Justify element$={element$} />
        <Reverse element$={element$} />
        <SpacingBetweenChildren element$={element$} />
      </TandemGroup>
      <Wrap element$={element$} />
    </>
  );
});
