export const ROOT_ID = 'root'

export interface IElements {
	[ROOT_ID]: IElement
	[ID: string]: IElement
}

export const defaultElements: IElements = {
	[ROOT_ID]: {
		id: ROOT_ID,
		name: 'Root Container',
		children: [],
		props: {},
		isExpanded: true,
	},
}

export interface IElement {
	id: string
	name: string
	parent?: string
	children: string[]
	props: Record<string, any>
	isExpanded: boolean
}
