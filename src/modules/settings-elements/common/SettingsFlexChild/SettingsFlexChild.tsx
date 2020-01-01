import React from 'react';

import { Atom, ReadOnlyAtom } from '@grammarly/focal';

import { Panel } from '../../../../generic/components/Panel';
import { IElementGeneric } from '../../../../generic/states/elements';
import { Align } from './Align';
import { Order } from './Order';
import { Sizing } from './Sizing';

interface IProps {
  element$: Atom<IElementGeneric>;
  parent$: ReadOnlyAtom<IElementGeneric>;
}

export const SettingsFlexChild = React.memo<IProps>(({ element$, parent$ }) => {
  return (
    <>
      <Panel title="Flex Child" />
      <Sizing element$={element$} parent$={parent$} />
      <Align element$={element$} parent$={parent$} />
      <Order element$={element$} />
    </>
  );
});
