import React from 'react'
import { style } from 'typestyle'
import { NestedCSSProperties } from 'typestyle/lib/types'

import { stateLayout$ } from '../../generic/states/state-app'
import { useObservable } from '../../generic/supply/react-helpers'
import { ElementsTree } from '../elements-tree/ElementsTree'
import { Preview } from '../preview/Preview'
import { Divider } from './Divider'
import { useLayoutEpic } from './epic'

const TREE_AREA = '1 / 1 / 2 / 2'
const CHILD_AREA = '1 / 2 / 2 / 3'
const PREVIEW_AREA = '1 / 3 / 2 / 4'

export const Layout = React.memo(() => {
	const style$ = useLayoutEpic()
	const style = useObservable(style$)
	return (
		<div className={$container} style={style}>
			<div className={$tree}>
				<ElementsTree />
			</div>
			<div className={$child}>d</div>
			<div className={$preview}>
				<Preview />
			</div>
			<Divider ward={stateLayout$.lens('treePanelWidth')} area={CHILD_AREA} />
			<Divider ward={stateLayout$.lens('nodePanelWidth')} area={PREVIEW_AREA} />
		</div>
	)
})

const $container = style({
	flexGrow: 1,
	display: 'grid',
	overflow: 'hidden',
})

const common: NestedCSSProperties = {
	display: 'flex',
	$nest: {
		'&>*': {
			flexGrow: 1,
			minWidth: 0,
		},
	},
}

const $tree = style(common, {
	gridArea: TREE_AREA,
	backgroundColor: 'rgba(255, 255, 255, 0.12)',
})

const $child = style(common, {
	gridArea: CHILD_AREA,
	backgroundColor: 'rgba(255, 255, 255, 0.12)',
})

const $preview = style(common, {
	gridArea: PREVIEW_AREA,
	backgroundColor: 'rgba(255, 255, 255, 0.06)',
})
