import { CANVAS_ID } from './elements'

export interface ITree {
	draggingID: string | null
	hoveredID: string | null
	focusedID: string | null
	flashedID: string | null
	scopedID: string | null // Used in context menu
	targetID: string | null
	parentID: string | null
	highlighter: {
		isVisible: boolean
		style: {
			top: number
			left: number
			width: number
		}
	}
	add: {
		inside: boolean
		above: boolean
		below: boolean
	}
}

export const defaultTree: ITree = {
	draggingID: null,
	hoveredID: null,
	focusedID: CANVAS_ID,
	flashedID: null,
	scopedID: null,
	targetID: null,
	parentID: null,
	highlighter: {
		isVisible: false,
		style: {
			top: 0,
			left: 0,
			width: 0,
		},
	},
	add: {
		inside: false,
		above: false,
		below: false,
	},
}
