import { Lens } from '@grammarly/focal'

import { EUnitType, IUnit } from './unit'

export const CANVAS_ID = 'canvas'
export const BODY_ID = 'body'

export enum EElementType {
	Flex = 'Flex',
	Grid = 'Grid',
	Component = 'Component',
}

export type TElementAny = IElementCanvas | IElementBody | IElement

export interface IElements {
	[ID: string]: TElementAny
}

export const defaultElements: IElements = {
	[CANVAS_ID]: {
		id: CANVAS_ID,
		width: {
			t: EUnitType.IntegerString,
			n: 800,
			s: 'px',
		},
		height: {
			t: EUnitType.IntegerString,
			n: 1000,
			s: 'px',
		},
	},
	[BODY_ID]: {
		id: BODY_ID,
		name: '',
		children: [],
		type: EElementType.Flex,
		props: {},
		isExpanded: true,
	},
}

export interface IElementCanvas {
	id: typeof CANVAS_ID
	width: IUnit
	height: IUnit
}

export interface IElementBody {
	id: typeof BODY_ID
	name: string
	children: string[]
	type: EElementType.Flex | EElementType.Grid
	props: {
		[EElementType.Flex]?: IElementFlex
		[EElementType.Grid]?: IElementGrid
	}
	isExpanded: boolean
}

export interface IElement {
	id: string
	name: string
	parent: string
	children: string[]
	type: EElementType
	props: {
		[EElementType.Flex]?: IElementFlex
		[EElementType.Grid]?: IElementGrid
		[EElementType.Component]?: IElementComponent
	}
	isExpanded: boolean
}

export interface IElementFlex {
	width: IUnit
	height: IUnit
}

export interface IElementGrid {
	width: IUnit
	height: IUnit
}

export interface IElementComponent {
	width: IUnit
	height: IUnit
}

export const lensElement = (id: string) => {
	return Lens.create<IElements, IElementCanvas | IElementBody | IElement>(
		(state) => state[id],
		(newValue, state) => {
			return { ...state, [id]: newValue }
		}
	)
}
