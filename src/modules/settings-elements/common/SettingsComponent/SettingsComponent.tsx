import React from 'react';

import { Atom } from '@grammarly/focal';

import { Alert } from '../../../../generic/components/Alert';
import { Panel } from '../../../../generic/components/Panel';
import { IElementGeneric } from '../../../../generic/states/elements';

interface IProps {
  element$: Atom<IElementGeneric>;
}

export const SettingsComponent = React.memo<IProps>(({ element$ }) => {
  return (
    <>
      <Panel title="Component" />
      <Alert icon="info" text="Not yet implemented" />
    </>
  );
});
