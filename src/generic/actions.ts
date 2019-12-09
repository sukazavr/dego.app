import { ca, ga } from './supply/action-helpers'

export const actionsTree = ga('tree', {
	addInside: ca<{ parentID: string }>(),
	addAbove: ca<{ neighborID: string }>(),
	addBelow: ca<{ neighborID: string }>(),
	delete: ca<{ id: string }>(),
	focus: ca<{ id: string }>(),
	editName: ca<{ id: string }>(),
})
