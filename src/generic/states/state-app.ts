import { Atom } from '@grammarly/focal';

import { defaultElements, IElements } from './elements';
import { defaultExport, IExport } from './export';
import { defaultLayout, ILayout } from './layout';
import { defaultShellState, IShellState } from './shell';
import { defaultTree, ITree } from './tree';

export interface IState {
  shell: IShellState;
  layout: ILayout;
  elements: IElements;
  tree: ITree;
  export: IExport;
}

export const defaultState: IState = {
  shell: defaultShellState,
  layout: defaultLayout,
  elements: defaultElements,
  tree: defaultTree,
  export: defaultExport,
};

export const stateApp$ = Atom.create<IState>(defaultState);
export const stateShell$ = stateApp$.lens('shell');
export const stateLayout$ = stateApp$.lens('layout');
export const stateElements$ = stateApp$.lens('elements');
export const stateTree$ = stateApp$.lens('tree');
export const stateExport$ = stateApp$.lens('export');
