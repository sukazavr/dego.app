import React from 'react';
import { style } from 'typestyle';

import { actionsExport, actionsTree } from '../../../generic/actions';
import { BODY_ID, CANVAS_ID } from '../../../generic/states/elements';
import { stateElements$, stateTree$ } from '../../../generic/states/state-app';
import { createUseWatcher } from '../../../generic/supply/react-helpers';
import { isElementGenericOrBody } from '../../../generic/supply/type-guards';
import { MenuDivider } from '../../context-menu/MenuDivider';
import { MenuItem } from '../../context-menu/MenuItem';

interface IProps {
  id: string;
}

export const ElementContextMenu = React.memo<IProps>(({ id }) => {
  useWatcher([id]);
  const elements = stateElements$.get();
  const element = elements[id];
  const hasChildren = isElementGenericOrBody(element) && element.children.length > 0;
  const isElementCanvas = id === CANVAS_ID;
  const isElementGeneric = id !== CANVAS_ID && id !== BODY_ID;
  return (
    <div className={$container}>
      <MenuItem children="Add Child" onClick={actionsTree.addInside._({ parentID: id })} />
      <MenuItem
        children="Add Before"
        onClick={actionsTree.addAbove._({ neighborID: id })}
        isDisabled={!isElementGeneric}
      />
      <MenuItem
        children="Add After"
        onClick={actionsTree.addBelow._({ neighborID: id })}
        isDisabled={!isElementGeneric}
      />
      <MenuDivider />
      <MenuItem
        children="Duplicate"
        onClick={actionsTree.duplicate._({ id })}
        isDisabled={!isElementGeneric}
      />
      <MenuDivider />
      <MenuItem
        children="Delete"
        onClick={actionsTree.delete._({ id })}
        isDisabled={!isElementGeneric}
      />
      <MenuItem
        children="Delete Children"
        onClick={actionsTree.deleteChildren._({ id })}
        isDisabled={isElementCanvas || !hasChildren}
      />
      <MenuDivider />
      <MenuItem
        children="Export"
        onClick={actionsExport.open._({ exportedID: isElementCanvas ? BODY_ID : id })}
      />
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
