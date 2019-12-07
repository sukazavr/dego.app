import React from 'react'
import { style } from 'typestyle'

import { useObservable } from '../../generic/supply/react-helpers'
import { tv } from '../../generic/supply/style-helpers'
import { dndState$ } from './state'

export const PLACEHOLDER_HEIGHT = 4

const $placeholder = style({
	height: PLACEHOLDER_HEIGHT,
	background: tv('select500'),
	position: 'absolute',
	pointerEvents: 'none',
	transitionDuration: '60ms',
	transitionProperty: 'top',
})

export const Highlighter = React.memo(() => {
	const dndState = useObservable(dndState$)
	if (dndState && dndState.canDrop) {
		return (
			<div
				className={$placeholder}
				style={{
					...dndState.placeholderStyle,
					top: dndState.placeholderStyle.top - PLACEHOLDER_HEIGHT / 2,
				}}
			/>
		)
	}
	return null
})
