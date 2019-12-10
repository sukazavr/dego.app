import React from 'react'
import { style } from 'typestyle'

import { lensElement } from '../../../generic/states/elements'
import { stateElements$ } from '../../../generic/states/state-app'
import { useObservable } from '../../../generic/supply/react-helpers'
import { isNotElementCanvas } from '../../../generic/supply/type-guards'
import { ElementContentExpander } from './ElementContentExpander'
import { ElementContentName } from './ElementContentName'

interface IProps {
	id: string
}

export const ElementContent: React.FC<IProps> = React.memo(({ id }) => {
	const element$ = React.useMemo(() => stateElements$.lens(lensElement(id)), [id])
	const element = useObservable(element$)
	let hasChildren = false
	let isExpanded = false
	if (isNotElementCanvas(element)) {
		hasChildren = Boolean(element.children.length)
		isExpanded = element.isExpanded
	}
	return (
		<div className={$container}>
			<ElementContentExpander
				element$={element$}
				hasChildren={hasChildren}
				isExpanded={isExpanded}
			/>
			<ElementContentName element$={element$} id={id} />
		</div>
	)
})

const $container = style({
	height: '3rem',
	display: 'flex',
	alignItems: 'center',
})
