import React from 'react'
import { style } from 'typestyle'

import { TIconName } from '../../../generic/icons'
import { EElementType, lensElementAny } from '../../../generic/states/elements'
import { stateElements$ } from '../../../generic/states/state-app'
import { flexIsRow } from '../../../generic/style-helpers/flex'
import { useObservable } from '../../../generic/supply/react-helpers'
import { isNotElementCanvas } from '../../../generic/supply/type-guards'
import { ElementContentExpander } from './ElementContentExpander'
import { ElementContentIcon } from './ElementContentIcon'
import { ElementContentName } from './ElementContentName'

interface IProps {
	id: string
}

export const ElementContent: React.FC<IProps> = React.memo(({ id }) => {
	const element$ = React.useMemo(() => stateElements$.lens(lensElementAny(id)), [id])
	const element = useObservable(element$)
	let hasChildren = false
	let isExpanded = false
	let icon: TIconName = 'canvas'
	if (isNotElementCanvas(element)) {
		hasChildren = Boolean(element.children.length)
		isExpanded = element.isExpanded
		if (element.type === EElementType.Flex) {
			icon = flexIsRow(element.props[EElementType.Flex].flexDirection) ? 'flexRow' : 'flexColumn'
		} else if (element.type === EElementType.Grid) {
			icon = 'grid'
		} else if (element.type === EElementType.Component) {
			icon = 'component'
		}
	}
	return (
		<div className={$container}>
			<ElementContentExpander
				element$={element$}
				hasChildren={hasChildren}
				isExpanded={isExpanded}
			/>
			<ElementContentIcon icon={icon} />
			<ElementContentName element$={element$} id={id} />
		</div>
	)
})

const $container = style({
	height: '3rem',
	display: 'flex',
	alignItems: 'center',
})
