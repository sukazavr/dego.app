import nanoid from 'nanoid'

import { IElement } from '../../generic/states/elements'

let index = 0

export const createTreeElement = (): IElement => ({
	id: nanoid(10),
	name: `_${++index}`,
	children: [],
	props: {},
	isExpanded: true,
})
