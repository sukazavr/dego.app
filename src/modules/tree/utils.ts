import nanoid from 'nanoid'

import { IElement, IElements } from '../../generic/states/elements'
import { defaultTree } from '../../generic/states/tree'
import { elStore } from './common'

let index = 0
export const createTreeElement = (): IElement => ({
	id: nanoid(10),
	name: `_${++index}`,
	children: [],
	props: {},
	isExpanded: true,
})

export const mutateAddInside = (draft: IElements, element: IElement, parentID: string) => {
	const parent = draft[parentID]
	if (parent) {
		element.parent = parentID
		const id = element.id
		parent.children.push(id)
		parent.isExpanded = true
		draft[id] = element
	}
}

export const mutateAddNeighbor = (
	draft: IElements,
	element: IElement,
	neighborID: string,
	below: boolean
) => {
	const parentID = draft[neighborID].parent
	if (parentID) {
		const parent = draft[parentID]
		if (parent) {
			element.parent = parentID
			const id = element.id
			const neighborIndex = parent.children.indexOf(neighborID)
			parent.children.splice(neighborIndex + Number(below), 0, id)
			draft[id] = element
		}
	}
}

export const mutateRemoveFromParent = (draft: IElements, element: IElement) => {
	if (element.parent) {
		const children = draft[element.parent].children
		const index = children.indexOf(element.id)
		if (index > -1) {
			children.splice(index, 1)
		}
	}
}

export const mutateRemoveFromTree = (draft: IElements, element: IElement) => {
	element.children.forEach((childID) => {
		const child = draft[childID]
		if (child) {
			mutateRemoveFromTree(draft, child)
		}
	})
	delete draft[element.id]
}

export const getPlaceholderStyle = (
	treeEl: HTMLDivElement,
	{ rect }: TElMeta,
	{ shift }: TElMeta,
	dir: 'top' | 'bottom'
) => {
	if (rect) {
		const rectTree = treeEl.getBoundingClientRect()
		return {
			top: rect[dir] - rectTree.top + treeEl.scrollTop,
			left: rect.left + shift - rectTree.left,
			width: rect.width - shift,
		}
	} else {
		return { ...defaultTree.highlighter.style }
	}
}

export const getElMeta = (elID: string): TElMeta => {
	const el = elStore.get(elID)
	if (el) {
		const rect = el.getBoundingClientRect()
		const tempEdge = Math.ceil(rect.height * 0.5)
		const tail = tempEdge % 2
		return {
			heightEdge: (tempEdge - tail) / 2,
			shift: parseFloat(getComputedStyle(el).paddingLeft as string),
			rect,
		}
	} else {
		return { ...defaultElMeta }
	}
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
