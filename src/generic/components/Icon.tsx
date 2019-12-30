import React from 'react';

import { icons, TIconName } from '../icons';

interface IProps extends React.SVGAttributes<SVGElement> {
  icon: TIconName;
  color?: string;
  size?: string;
  role?: 'presentation' | 'img';
}

export const Icon = React.memo<IProps>(
  ({ icon, color = DEFAULT_COLOR, size = DEFAULT_SIZE, role = 'presentation', ...rest }) => {
    const { viewBox, path } = icons[icon];
    return (
      <svg role={role} width={size} height={size} viewBox={viewBox} fill={color} {...rest}>
        {path}
      </svg>
    );
  }
);

const DEFAULT_COLOR = 'currentColor';
const DEFAULT_SIZE = '1em';
