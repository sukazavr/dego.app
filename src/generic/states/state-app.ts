import { Atom } from '@grammarly/focal'

import { defaultLayout, ILayout } from './layout'
import { defaultShellState, IShellState } from './shell'

export interface IState {
	shell: IShellState
	layout: ILayout
}

export const defaultState: IState = {
	shell: defaultShellState,
	layout: defaultLayout,
}

export const stateApp$ = Atom.create<IState>(defaultState)
export const stateShell$ = stateApp$.lens('shell')
export const stateLayout$ = stateApp$.lens('layout')
