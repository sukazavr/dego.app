import React from 'react';

import { Atom } from '@grammarly/focal';

import { IElementCommonProps } from '../../../../generic/states/elements';
import { Size } from './Size';

interface IProps {
  commonProps$: Atom<IElementCommonProps>;
}

export const SettingsCommon = React.memo<IProps>(({ commonProps$ }) => {
  return (
    <>
      <Size commonProps$={commonProps$} />
    </>
  );
});
