import React from 'react';
import { style } from 'typestyle';

import { BODY_ID } from '../../generic/states/elements';
import { useObservable } from '../../generic/supply/react-helpers';
import { tv } from '../../generic/supply/style-helpers';
import { fontPreview, scrollRegular } from '../../generic/theme';
import { Node } from './Node';
import { usePreviewWatcher } from './watcher';

export const Preview = React.memo(() => {
  const ref = React.useRef<HTMLDivElement>(null);
  const canvasStyle$ = usePreviewWatcher([ref]);
  const canvasStyle = useObservable(canvasStyle$);
  return (
    <div ref={ref} className={$container}>
      <div className={$center}>
        <div className={$canvas} style={canvasStyle}>
          <Node elementID={BODY_ID} />
        </div>
      </div>
    </div>
  );
});

const $container = style(scrollRegular, {
  flexGrow: 1,
  display: 'flex',
  overflow: 'scroll',
  backgroundColor: tv('base100'),
  cursor: 'move',
  $nest: {
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: tv('base900'),
    },
  },
});

const $center = style({
  flexGrow: 1,
  display: 'grid',
  placeItems: 'center center',
});

const $canvas = style(fontPreview, {
  margin: '6em',
  backgroundColor: tv('base'),
  backgroundImage: `url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2 2"><path d="M1 2V0h1v1H0v1z" fill-opacity=".06"/></svg>')`,
  backgroundSize: '20px',
  outline: `1px solid ${tv('base900')}`,
  overflow: 'hidden',
  color: tv('base'),
  cursor: 'default',
});
