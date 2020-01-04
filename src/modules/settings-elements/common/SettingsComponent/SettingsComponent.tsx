import React from 'react';

import { Atom } from '@grammarly/focal';

import { Panel } from '../../../../generic/components/Panel';
import { IElementComponentProps } from '../../../../generic/states/elements';
import { Color } from './Color';
import { RandomText } from './RandomText';

interface IProps {
  componentProps$: Atom<IElementComponentProps>;
}

export const SettingsComponent = React.memo<IProps>(({ componentProps$ }) => {
  return (
    <>
      <Panel title="Component" />
      <Color componentProps$={componentProps$} />
      <RandomText componentProps$={componentProps$} />
    </>
  );
});
