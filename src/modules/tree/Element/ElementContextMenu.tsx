import React from 'react';
import { style } from 'typestyle';

import { actionsExport, actionsTree } from '../../../generic/actions';
import { BODY_ID, CANVAS_ID } from '../../../generic/states/elements';
import { stateTree$ } from '../../../generic/states/state-app';
import { createUseWatcher } from '../../../generic/supply/react-helpers';
import { MenuDivider } from '../../context-menu/MenuDivider';
import { MenuItem } from '../../context-menu/MenuItem';

interface IProps {
  id: string;
}

export const ElementContextMenu = React.memo<IProps>(({ id }) => {
  useWatcher([id]);
  const isElementCanvas = id === CANVAS_ID;
  const isElementGeneric = id !== CANVAS_ID && id !== BODY_ID;
  return (
    <div className={$container}>
      <MenuItem children="Add Child" onClick={actionsTree.addInside._({ parentID: id })} />
      {isElementGeneric && (
        <>
          <MenuItem children="Add Before" onClick={actionsTree.addAbove._({ neighborID: id })} />
          <MenuItem children="Add After" onClick={actionsTree.addBelow._({ neighborID: id })} />
          <MenuDivider />
          <MenuItem children="Duplicate" onClick={actionsTree.duplicate._({ id })} />
          <MenuDivider />
          <MenuItem children="Delete" onClick={actionsTree.delete._({ id })} />
        </>
      )}
      {!isElementCanvas && (
        <>
          <MenuDivider />
          <MenuItem children="Export" onClick={actionsExport.open._({ exportedID: id })} />
        </>
      )}
    </div>
  );
});

const useWatcher = createUseWatcher<[string], void>(({ currentDeps$ }) => {
  currentDeps$.subscribe({
    next: ([id]) => {
      stateTree$.lens('scopedID').set(id);
    },
    complete: () => {
      stateTree$.lens('scopedID').set(null);
    },
  });
});

const $container = style({
  minWidth: '140px',
});
