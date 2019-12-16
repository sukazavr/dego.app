import { Lens } from '@grammarly/focal'

import { TFlexDirection } from '../style-helpers/flex'
import { EUnitType, IUnit } from './unit'

export const CANVAS_ID = 'canvas'
export const BODY_ID = 'body'

export enum EElementType {
	Flex = 'Flex',
	Grid = 'Grid',
	Component = 'Component',
}

export enum ECanvasType {
	Div,
	FlexRow,
	FlexColumn,
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
		isTransparent: true,
		type: ECanvasType.Div,
	},
	[BODY_ID]: {
		id: BODY_ID,
		name: '',
		children: [],
		type: EElementType.Flex,
		props: {
			Flex: {
				flexDirection: 'column',
			},
			Grid: {},
		},
		isExpanded: true,
	},
}

export interface IElementCanvas {
	id: typeof CANVAS_ID
	width: IUnit
	height: IUnit
	type: ECanvasType
	isTransparent: boolean
}

export interface IElementBody {
	id: typeof BODY_ID
	name: string
	children: string[]
	type: EElementType.Flex | EElementType.Grid
	props: {
		[EElementType.Flex]: Partial<IElementFlex>
		[EElementType.Grid]: Partial<IElementGrid>
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
		[EElementType.Flex]: Partial<IElementFlex>
		[EElementType.Grid]: Partial<IElementGrid>
		[EElementType.Component]: Partial<IElementComponent>
	}
	isExpanded: boolean
}

export interface IElementFlex {
	width: IUnit
	height: IUnit
	flexDirection: TFlexDirection
}

export interface IElementGrid {
	width: IUnit
	height: IUnit
}

export interface IElementComponent {
	width: IUnit
	height: IUnit
}

export const lensElementAny = (id: string) => {
	return Lens.create<IElements, TElementAny>(
		(state) => state[id] || defaultElements[BODY_ID],
		(newValue, state) => {
			return { ...state, [id]: newValue }
		}
	)
}

export const lensElementCanvas = Lens.create<IElements, IElementCanvas>(
	(state) => state[CANVAS_ID] as IElementCanvas,
	(newValue, state) => {
		return { ...state, [CANVAS_ID]: newValue }
	}
)
