import React from 'react';

import { icons, TIconName } from '../icons';
import { isDefined } from '../supply/type-guards';

interface IProps extends React.SVGAttributes<SVGElement> {
  icon: TIconName;
  color?: string;
  size?: string;
  role?: 'presentation' | 'img';
  rotate?: 1 | 2 | 3; // 1 = 90deg, 2 = 180deg, 3 = 270deg
}

export const Icon = React.memo<IProps>(
  ({
    icon,
    color = DEFAULT_COLOR,
    size = DEFAULT_SIZE,
    role = 'presentation',
    rotate,
    ...rest
  }) => {
    const { viewBox, path } = icons[icon];
    const props: React.SVGProps<SVGSVGElement> = {
      role,
      width: size,
      height: size,
      viewBox,
      fill: color,
    };
    if (isDefined(rotate)) {
      props.transform = `rotate(${rotate * 90})`;
    }
    return (
      <svg {...props} {...rest}>
        {path}
      </svg>
    );
  }
);

const DEFAULT_COLOR = 'currentColor';
const DEFAULT_SIZE = '1em';
