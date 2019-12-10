import React from 'react'
import { style } from 'typestyle'

import { lensElement } from '../../../generic/states/elements'
import { stateElements$ } from '../../../generic/states/state-app'
import { useObservable } from '../../../generic/supply/react-helpers'
import { ElementContentExpander } from './ElementContentExpander'
import { ElementContentName } from './ElementContentName'

interface IProps {
	id: string
}

export const ElementContent: React.FC<IProps> = React.memo(({ id }) => {
	const element$ = React.useMemo(() => stateElements$.lens(lensElement(id)), [id])
	const element = useObservable(element$)
	return (
		<div className={$container}>
			<ElementContentExpander element$={element$} element={element} />
			<ElementContentName element$={element$} element={element} />
		</div>
	)
})

const $container = style({
	height: '3rem',
	display: 'flex',
	alignItems: 'center',
})
