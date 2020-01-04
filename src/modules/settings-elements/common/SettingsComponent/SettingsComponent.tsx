import React from 'react';

import { Atom } from '@grammarly/focal';

import { Panel } from '../../../../generic/components/Panel';
import { IElementGeneric } from '../../../../generic/states/elements';
import { Color } from './Color';

interface IProps {
  element$: Atom<IElementGeneric>;
}

export const SettingsComponent = React.memo<IProps>(({ element$ }) => {
  return (
    <>
      <Panel title="Component" />
      <Color element$={element$} />
    </>
  );
});
