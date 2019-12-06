import React from 'react'
import { style } from 'typestyle'

import { useObservable } from '../../generic/supply/react-helpers'
import { scroll, tv } from '../../generic/theme'
import { usePreviewEpic } from './epic'

export const Preview = React.memo(() => {
	const ref = React.useRef<HTMLDivElement>(null)
	const canvasStyle$ = usePreviewEpic([ref])
	const canvasStyle = useObservable(canvasStyle$)
	return (
		<div ref={ref} className={$container}>
			<div className={$center}>
				<div className={$canvas} style={canvasStyle} />
			</div>
		</div>
	)
})

const $container = style(scroll, {
	flexGrow: 1,
	display: 'flex',
	overflow: 'scroll',
	backgroundColor: tv('base100'),
	$nest: {
		'&::-webkit-scrollbar-thumb': {
			backgroundColor: tv('base900'),
		},
	},
})

const $center = style({
	flexGrow: 1,
	display: 'grid',
	placeItems: 'center center',
})

const $canvas = style({
	margin: '6em',
	backgroundColor: tv('base'),
	backgroundImage: `url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2 2"><path d="M1 2V0h1v1H0v1z" fill-opacity=".025"/></svg>')`,
	backgroundSize: '20px 20px',
	border: `1px solid ${tv('base900')}`,
})
