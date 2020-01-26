import React from 'react';
import { style } from 'typestyle';

import { stateTree$ } from '../../generic/states/state-app';
import { useObservableFabric } from '../../generic/supply/react-helpers';
import { tv } from '../../generic/supply/style-helpers';
import { isNotNull } from '../../generic/supply/type-guards';
import { getNodeElementsCollection } from './node-elements-collection';

export const PreviewHighlighter = React.memo(() => {
  const hoveredID = useObservableFabric(() => stateTree$.view('hoveredID'), []);
  if (isNotNull(hoveredID)) {
    const collection = getNodeElementsCollection(hoveredID);
    return (
      <>
        {collection.map((el, index) => {
          const rect = el.getBoundingClientRect();
          return (
            <div
              key={index}
              className={$placeholder}
              style={{
                top: rect.top,
                left: rect.left,
                width: rect.width,
                height: rect.height,
              }}
            />
          );
        })}
      </>
    );
  }
  return null;
});

const $placeholder = style({
  pointerEvents: 'none',
  position: 'absolute',
  background: tv('select500'),
  opacity: 0.5,
});
