import React from 'react';

import { Atom } from '@grammarly/focal';

import { Panel } from '../../../../generic/components/Panel';
import { TandemGroup } from '../../../../generic/components/TandemGroup';
import { IElementFlexParentProps } from '../../../../generic/states/elements';
import { Align } from './Align';
import { Justify } from './Justify';
import { Reverse } from './Reverse';
import { SpacingBetweenChildren } from './SpacingBetweenChildren';
import { Wrap } from './Wrap';

interface IProps {
  flexParentProps$: Atom<IElementFlexParentProps>;
}

export const SettingsFlexParent = React.memo<IProps>(({ flexParentProps$ }) => {
  return (
    <>
      <Panel title="Flex Parent" />
      <TandemGroup>
        <Align flexParentProps$={flexParentProps$} />
        <Justify flexParentProps$={flexParentProps$} />
        <Reverse flexParentProps$={flexParentProps$} />
        <SpacingBetweenChildren flexParentProps$={flexParentProps$} />
      </TandemGroup>
      <Wrap flexParentProps$={flexParentProps$} />
    </>
  );
});
