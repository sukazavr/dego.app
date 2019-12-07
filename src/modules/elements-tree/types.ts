export interface IElementProps {
	id: string
	path: string[]
}

// 1st - all sorted elements id's
// 2nd - parent path to element by id
// 3nd - max children id deep by parent id
export type TTreeIndex = [string[], { [id: string]: string[] }, { [id: string]: string }]

export type TDnDElementProps = IElementProps & {
	connectDragSource: (el: Element) => void
	connectDropTarget: (el: Element) => void
	connectDragEmptyPreview: () => void
}

export type TDnDTreeProps = {
	connectDropTarget: (el: Element) => void
}

export type TCursorPosition = null | {
	x: number
	y: number
}

export type TTreeElMeta = {
	scrollTop: number
	rect: ClientRect
}

export type TElMeta = {
	heightEdge: number
	shift: number
	rect: ClientRect | null
}

export const defaultElMeta: TElMeta = {
	heightEdge: 0,
	shift: 0,
	rect: null,
}

export interface IDnDState {
	canDrop: boolean
	addInside: boolean
	addAbove: boolean
	addBelow: boolean
	sourceID: string
	targetID: null | string
	placeholderParentID: null | string
	placeholderStyle: {
		top: number
		left: number
		width: number
	}
}

export const defaultDnDState: IDnDState = {
	canDrop: false,
	addInside: false,
	addAbove: false,
	addBelow: false,
	sourceID: '',
	targetID: null,
	placeholderParentID: null,
	placeholderStyle: {
		top: 0,
		left: 0,
		width: 0,
	},
}
