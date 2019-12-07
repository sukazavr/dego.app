import React from 'react'
import { style } from 'typestyle'

import { actionsTree } from '../../generic/actions'
import { ROOT_ID } from '../../generic/states/elements'
import { useObservable } from '../../generic/supply/react-helpers'
import { scroll } from '../../generic/theme'
import { MenuContainer } from '../context-menu/ContextMenu'
import { useContextMenu } from '../context-menu/hook'
import { MenuItem } from '../context-menu/MenuItem'
import { Element } from './Element'
import { Highlighter, PLACEHOLDER_HEIGHT } from './Highlighter'
import { makeDnDRoot } from './make-dnd'
import { setTreeEl, tree$ } from './state'
import { TDnDTreeProps } from './types'

export const Tree = makeDnDRoot(
	React.memo<TDnDTreeProps>(({ connectDropTarget }) => {
		const ref = React.useRef<HTMLDivElement>(null)
		const ctxMenuElements = useContextMenu(({ position }) => (
			<MenuContainer position={position}>
				<MenuItem
					children="Create Element"
					onClick={actionsTree.addInside._({ parentID: ROOT_ID })}
				/>
			</MenuContainer>
		))
		const d = useObservable(tree$)
		React.useEffect(() => {
			const el = ref.current as HTMLDivElement
			connectDropTarget(el)
			setTreeEl(el)
			return () => setTreeEl(null)
		}, [ref, connectDropTarget])
		if (d) {
			const [index, paths] = d
			return (
				<div ref={ref} className={$container} onContextMenu={ctxMenuElements.open({})}>
					{index.map((id) => (
						<Element key={id} id={id} path={paths[id]} />
					))}
					<Highlighter />
				</div>
			)
		}
		return null
	})
)

const $container = style(scroll, {
	flexGrow: 1,
	position: 'relative',
	overflow: 'hidden auto',
	paddingBottom: PLACEHOLDER_HEIGHT,
})
