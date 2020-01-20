import React from 'react';

import { Atom } from '@grammarly/focal';

import { Panel } from '../../../../generic/components/Panel';
import { TandemGroup } from '../../../../generic/components/TandemGroup';
import { IElementMockupProps } from '../../../../generic/states/elements';
import { EElementVirtualType } from '../types';
import { BG } from './BG';
import { Instances } from './Instances';
import { RandomText } from './RandomText';

interface IProps {
  virtualType: EElementVirtualType;
  mockupProps$: Atom<IElementMockupProps>;
}

export const SettingsMockup = React.memo<IProps>(({ virtualType, mockupProps$ }) => {
  return (
    <>
      <Panel title="Mockup (not for export)" />
      <TandemGroup>
        <Instances mockupProps$={mockupProps$} />
      </TandemGroup>
      <BG mockupProps$={mockupProps$} />
      {virtualType === EElementVirtualType.Component && <RandomText mockupProps$={mockupProps$} />}
    </>
  );
});
