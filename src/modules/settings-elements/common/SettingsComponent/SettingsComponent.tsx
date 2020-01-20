import React from 'react';

import { Atom } from '@grammarly/focal';

import { Panel } from '../../../../generic/components/Panel';
import { IElementComponentProps } from '../../../../generic/states/elements';
import { Tag } from './Tag';

interface IProps {
  componentProps$: Atom<IElementComponentProps>;
}

export const SettingsComponent = React.memo<IProps>(({ componentProps$ }) => {
  return (
    <>
      <Panel title="Component" />
      <Tag componentProps$={componentProps$} />
    </>
  );
});
