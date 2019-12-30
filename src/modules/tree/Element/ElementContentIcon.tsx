import React from 'react';
import { style } from 'typestyle';

import { Icon } from '../../../generic/components/Icon';
import { TIconName } from '../../../generic/icons';

interface IProps {
  icon: TIconName;
}

export const ElementContentIcon = React.memo<IProps>(({ icon }) => {
  return (
    <div className={$container}>
      <Icon icon={icon} />
    </div>
  );
});

const $container = style({
  flex: 'none',
  fontSize: '3rem',
  height: '1em',
});
