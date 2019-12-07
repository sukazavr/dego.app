import { Atom } from '@grammarly/focal'

import { defaultElements, IElements } from './elements'
import { defaultLayout, ILayout } from './layout'
import { defaultShellState, IShellState } from './shell'

export interface IState {
	shell: IShellState
	layout: ILayout
	elements: IElements
}

export const defaultState: IState = {
	shell: defaultShellState,
	layout: defaultLayout,
	elements: defaultElements,
}

export const stateApp$ = Atom.create<IState>(defaultState)
export const stateShell$ = stateApp$.lens('shell')
export const stateLayout$ = stateApp$.lens('layout')
export const stateElements$ = stateApp$.lens('elements')
