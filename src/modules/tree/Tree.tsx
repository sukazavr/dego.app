import React from 'react'
import { style } from 'typestyle'

import { actionsTree } from '../../generic/actions'
import { BODY_ID } from '../../generic/states/elements'
import { useObservable } from '../../generic/supply/react-helpers'
import { scrollRegular } from '../../generic/theme'
import { useContextMenu } from '../context-menu/hook'
import { MenuItem } from '../context-menu/MenuItem'
import { Element } from './Element/Element'
import { Highlighter, PLACEHOLDER_HEIGHT } from './Highlighter'
import { useTreeDragWatcher } from './watchers/drag'
import { useTreeEasyWatcher } from './watchers/easy'

export const Tree = React.memo(() => {
	useTreeEasyWatcher()
	const ref = React.useRef<HTMLDivElement>(null)
	const { tree$ } = useTreeDragWatcher([ref])
	const { treeIndex, treePaths } = useObservable(tree$)
	const ctxMenu = useContextMenu(() => (
		<>
			<MenuItem
				children="Create Element"
				onClick={actionsTree.addInside._({ parentID: BODY_ID })}
			/>
		</>
	))
	return (
		<div ref={ref} className={$container} onContextMenu={ctxMenu.open({})}>
			{treeIndex.map((id) => (
				<Element key={id} id={id} path={treePaths[id]} />
			))}
			<Highlighter />
		</div>
	)
})

const $container = style(scrollRegular, {
	flexGrow: 1,
	position: 'relative',
	overflow: 'hidden auto',
	paddingBottom: PLACEHOLDER_HEIGHT,
})
