import React from 'react';
import ReactTooltip from 'react-tooltip';
import { style } from 'typestyle';

import { createSharedProvider } from '../../generic/supply/react-helpers';
import { tv } from '../../generic/supply/style-helpers';
import { fontRegular } from '../../generic/theme';

export const TooltipProvider: React.FC = () => {
  React.useEffect(() => {
    ReactTooltip.rebuild();
  });
  return <Tooltip />;
};

const Tooltip = createSharedProvider(() => (
  <ReactTooltip className={$container} delayShow={150} effect="solid" />
));

const $container = style({
  $nest: {
    '.__react_component_tooltip&': {
      ...fontRegular,
      padding: '1rem',
      backgroundColor: tv('base900'),
      color: tv('base'),
      opacity: 1,
    },
    '.__react_component_tooltip.type-dark.place-top&:after': {
      borderTopColor: tv('base900'),
    },
  },
});
