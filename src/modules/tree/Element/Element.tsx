import React from 'react'
import { keyframes, style } from 'typestyle'

import { actionsTree } from '../../../generic/actions'
import { ROOT_ID } from '../../../generic/states/elements'
import { stateTree$ } from '../../../generic/states/state-app'
import { useEnhancedEffect, useObservableFabric } from '../../../generic/supply/react-helpers'
import { tv } from '../../../generic/supply/style-helpers'
import { isPresent } from '../../../generic/supply/type-guards'
import { fontRegular } from '../../../generic/theme'
import { useContextMenu } from '../../context-menu/hook'
import {
	elStore, treeElementEndDragging, treeElementOnDrag, treeElementSetTarget,
	treeElementStartDragging,
} from '../common'
import { ElementContextMenu } from './ElementContextMenu'

interface IProps {
	id: string
	path: string[]
}

export const Element = React.memo<IProps>(({ id, path }) => {
	// TODO: REMOVE
	console.log('Ren Element', id, path)
	const ref = React.useRef<HTMLDivElement>(null)
	useEnhancedEffect(() => {
		const el = ref.current as HTMLDivElement
		elStore.set(id, el)
		return () => {
			elStore.delete(id)
		}
	}, [id, ref])
	const constantProps = React.useMemo(() => {
		return {
			onMouseEnter: () => stateTree$.lens('hoveredID').set(id),
			onMouseLeave: () => stateTree$.lens('hoveredID').set(null),
			onDragStart:
				id === ROOT_ID
					? (e: React.DragEvent<HTMLDivElement>) => e.preventDefault()
					: treeElementStartDragging._(id),
			onClick: actionsTree.focus._({ id }),
			style: { paddingLeft: `${(path.length - 1) * 0.8}em` },
		}
	}, [id, path])
	const stateTreeProps = useObservableFabric(
		() =>
			stateTree$.view(({ draggingID, parentID, hoveredID, focusedID, scopedID, flashedID }) => {
				const classNames: (string | boolean)[] = [$container]
				if (isPresent(draggingID)) {
					classNames.push(parentID === id ? $parented : path.includes(draggingID) && $dragging)
				} else {
					classNames.push(
						hoveredID === id && $hovered,
						focusedID === id && $focused,
						scopedID === id && $scoped,
						flashedID === id && $flashed
					)
				}
				return {
					className: classNames.filter(Boolean).join(' '),
					onDragOver: (e: React.DragEvent) => {
						if (draggingID && !path.includes(draggingID)) {
							e.preventDefault()
							treeElementSetTarget(id)
						}
					},
				}
			}),
		[id, path]
	)
	const ctxMenu = useContextMenu<{ id: string }>(({ payload }) => {
		return <ElementContextMenu {...payload} />
	})
	return React.createElement('div', {
		ref,
		draggable: true,
		onDrag: treeElementOnDrag,
		onDragEnd: treeElementEndDragging,
		...constantProps,
		...stateTreeProps,
		children: id,
		onContextMenu: ctxMenu.open({ id }),
	})
})

const $container = style(fontRegular, {
	height: '3rem',
})

const $parented = style({
	boxShadow: `inset 0 0 0 1px ${tv('select500')}`,
})

const $dragging = style({
	backgroundColor: 'rgba(102, 170, 255, 0.17)',
})

const $hovered = style({
	boxShadow: `inset 0 0 0 1px ${tv('select500')}`,
})

const $focused = style({
	color: tv('base'),
	backgroundColor: tv('select500'),
})

const $scoped = style({
	boxShadow: `inset 0 0 0 2px ${tv('select500')}`,
})

const FLASH_DURATION = 600
const $flashed = style({
	animationName: keyframes({
		'0%': { opacity: 0, transform: 'rotateX(90deg) scale3d(1.2, 1.2, 1.2)' },
		'50%': {
			opacity: 1,
			animationTimingFunction: 'cubic-bezier(0.455, 0.03, 0.515, 0.955)',
			transform: 'rotateX(-20deg) scale3d(1, 1, 1)',
		},
		'100%': {
			transform: 'rotateX(0deg) scale3d(1, 1, 1)',
		},
	}),
	animationDuration: `${FLASH_DURATION}ms`,
})
