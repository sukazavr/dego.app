import React from 'react';

import { actionsTree } from '../../../generic/actions';
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
  const isElementGeneric = id !== CANVAS_ID && id !== BODY_ID;
  return (
    <>
      <MenuItem children="Add Element Inside" onClick={actionsTree.addInside._({ parentID: id })} />
      {isElementGeneric && (
        <>
          <MenuItem
            children="Add Element Above"
            onClick={actionsTree.addAbove._({ neighborID: id })}
          />
          <MenuItem
            children="Add Element Below"
            onClick={actionsTree.addBelow._({ neighborID: id })}
          />
          <MenuDivider />
          <MenuItem children="Duplicate" onClick={actionsTree.duplicate._({ id })} />
          <MenuDivider />
          <MenuItem children="Delete" onClick={actionsTree.delete._({ id })} />
        </>
      )}
    </>
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
