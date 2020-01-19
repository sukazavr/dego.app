import React from 'react';
import ReactTooltip from 'react-tooltip';
import { style } from 'typestyle';

import { ButtonSecondary } from '../../generic/components/ButtonSecondary';
import { Icon } from '../../generic/components/Icon';
import { Stack } from '../../generic/components/Stack';
import { tv } from '../../generic/supply/style-helpers';
import { isNotNull } from '../../generic/supply/type-guards';
import { fontRegularBig } from '../../generic/theme';

export const Update = React.memo(() => {
  const ref = React.useRef<HTMLButtonElement>(null);
  React.useEffect(() => {
    window.setTimeout(() => {
      if (isNotNull(ref.current)) {
        ReactTooltip.show(ref.current);
      }
    }, 0);
  }, []);
  return (
    <>
      <ReactTooltip
        className={$tooltip}
        effect="solid"
        id="update"
        event="none"
        eventOff="click"
        clickable={true}
        scrollHide={false}
        resizeHide={false}
      >
        <Stack
          spacing={0.4}
          isInline
          isCentered
          className={$updateMessage}
          title="Click to hide this tip"
          onClick={() => {
            if (isNotNull(ref.current)) {
              ReactTooltip.hide(ref.current);
            }
          }}
        >
          <div>Update available</div>
          <Icon icon="close" size="16" />
        </Stack>
      </ReactTooltip>
      <ButtonSecondary
        ref={ref}
        children="Update"
        data-tip
        data-for="update"
        onClick={() => {
          // we need forcedReload coz Galaxy S8 can't reload without it
          window.location.reload(true);
        }}
      />
    </>
  );
});

const $tooltip = style({
  $nest: {
    '.__react_component_tooltip&': {
      padding: 0,
      backgroundColor: tv('error500'),
      opacity: 1,
    },
    '.__react_component_tooltip.type-dark.place-top&:after': {
      borderTopColor: tv('error500'),
    },
  },
});

const $updateMessage = style(fontRegularBig, {
  padding: '1rem 1rem 1rem 1.4rem',
  color: tv('base'),
  cursor: 'pointer',
  $nest: {
    '&:hover': {
      color: tv('base100'),
    },
  },
});
