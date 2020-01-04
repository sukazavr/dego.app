import React from 'react';

import { Atom, ReadOnlyAtom } from '@grammarly/focal';

import { Panel } from '../../../../generic/components/Panel';
import {
    IElementFlexChildProps, IElementFlexParentProps,
} from '../../../../generic/states/elements';
import { Align } from './Align';
import { Order } from './Order';
import { Sizing } from './Sizing';

interface IProps {
  flexChildProps$: Atom<IElementFlexChildProps>;
  parentFlexParentProps$: ReadOnlyAtom<IElementFlexParentProps>;
}

export const SettingsFlexChild = React.memo<IProps>(
  ({ flexChildProps$, parentFlexParentProps$ }) => {
    return (
      <>
        <Panel title="Flex Child" />
        <Sizing flexChildProps$={flexChildProps$} parentFlexParentProps$={parentFlexParentProps$} />
        <Align flexChildProps$={flexChildProps$} parentFlexParentProps$={parentFlexParentProps$} />
        <Order flexChildProps$={flexChildProps$} />
      </>
    );
  }
);
