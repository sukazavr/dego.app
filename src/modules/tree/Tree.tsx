import React from 'react';
import { style } from 'typestyle';

import { actionsTree } from '../../generic/actions';
import { BODY_ID } from '../../generic/states/elements';
import { stateTree$ } from '../../generic/states/state-app';
import { useObservableFabric } from '../../generic/supply/react-helpers';
import { isNull } from '../../generic/supply/type-guards';
import { scrollRegular } from '../../generic/theme';
import { useContextMenu } from '../context-menu/hook';
import { MenuItem } from '../context-menu/MenuItem';
import { Element } from './Element/Element';
import { Highlighter, PLACEHOLDER_HEIGHT } from './Highlighter';
import { useTreeDragWatcher } from './watchers/drag';
import { useTreeEasyWatcher } from './watchers/easy';

export const Tree = React.memo(() => {
  useTreeEasyWatcher();
  const ref = React.useRef<HTMLDivElement>(null);
  const { tree$ } = useTreeDragWatcher([ref]);
  const list = useObservableFabric(
    () =>
      tree$.view(({ treeIndex, treePaths }) =>
        treeIndex.map((id) => <Element key={id} id={id} path={treePaths[id]} />)
      ),
    []
  );
  const ctxMenu = useContextMenu(() => (
    <>
      <MenuItem
        children="Create Element"
        onClick={actionsTree.addInside._({ parentID: BODY_ID })}
      />
    </>
  ));
  const style = useObservableFabric(
    () =>
      stateTree$
        .view('flashedID')
        .view((v) => (isNull(v) ? undefined : ({ overflowX: 'hidden' } as React.CSSProperties))),
    []
  );
  return (
    <div ref={ref} className={$container} style={style} onContextMenu={ctxMenu.open({})}>
      <div className={$wrapper}>
        {list}
        <Highlighter />
      </div>
    </div>
  );
});

const $container = style(scrollRegular, {
  flexGrow: 1,
  display: 'flex',
  position: 'relative',
  overflow: 'auto',
});

const $wrapper = style({
  flexGrow: 1,
  height: 'fit-content',
  paddingBottom: PLACEHOLDER_HEIGHT,
});
