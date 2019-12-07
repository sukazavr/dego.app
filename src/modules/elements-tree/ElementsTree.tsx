import './epic'

import React from 'react'
import { style } from 'typestyle'

import { CursorCapture } from './make-dnd'
import { Tree } from './Tree'

interface IProps {}

export const ElementsTree = React.memo<IProps>(() => {
	return (
		<div className={$container}>
			<Tree />
			<CursorCapture />
		</div>
	)
})

const $container = style({
	display: 'flex',
	flexDirection: 'column',
})
