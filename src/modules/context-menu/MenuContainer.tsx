import React from 'react'
import { animationFrameScheduler, BehaviorSubject, merge } from 'rxjs'
import {
	filter, map, mapTo, observeOn, switchMapTo, takeUntil, withLatestFrom,
} from 'rxjs/operators'
import { classes, style } from 'typestyle'

import { createUseWatcher, useObservable } from '../../generic/supply/react-helpers'
import { documentClicked$, escPressed$ } from '../../generic/supply/rxjs-helpers'
import { tv } from '../../generic/supply/style-helpers'
import { isNotNull } from '../../generic/supply/type-guards'
import { closeContextMenu, IContextMenuPayload, sendToContextMenuProvider } from './state'

const PADDING = 20

export const MenuContainer = React.memo(() => {
	const ref = React.useRef<HTMLDivElement>(null)
	const { node$, style$ } = useWatcher([ref])
	const node = useObservable(node$)
	const style = useObservable(style$)
	return (
		<div
			className={classes($container, isNotNull(node) && $visible)}
			ref={ref}
			style={style}
			children={node}
		/>
	)
})

const $container = style({
	position: 'absolute',
	top: 0,
	left: 0,
})

const $visible = style({
	zIndex: 100,
	border: `1px solid ${tv('base900')}`,
	background: tv('base'),
	padding: '.5rem 0',
	boxShadow: '1rem 1rem 0 rgba(0,0,0,.15)',
})

const useWatcher = createUseWatcher<
	[React.RefObject<HTMLDivElement>],
	{
		node$: BehaviorSubject<IContextMenuPayload['node']>
		style$: BehaviorSubject<IContextMenuPayload['position'] | undefined>
	}
>(({ didMount$, didUnmount$, deps$ }) => {
	const node$ = new BehaviorSubject<IContextMenuPayload['node']>(null)
	const style$ = new BehaviorSubject<IContextMenuPayload['position'] | undefined>(undefined)

	didMount$
		.pipe(
			switchMapTo(sendToContextMenuProvider.$.pipe(filter((v) => isNotNull(v.node)))),
			map(({ node, position }) => {
				node$.next(node)
				return position
			}),
			withLatestFrom(deps$),
			observeOn(animationFrameScheduler),
			map(([position, [ref]]) => {
				const el = ref.current as HTMLDivElement
				const { width, height } = el.getBoundingClientRect()
				const pWidth = window.innerWidth - PADDING
				const pHeight = window.innerHeight - PADDING

				let nTop = Math.max(PADDING, position.top)
				nTop = nTop + height > pHeight ? pHeight - height : nTop

				let nLeft = Math.max(PADDING, position.left)
				nLeft = nLeft + width > pWidth ? pWidth - width : nLeft

				return {
					top: nTop,
					left: nLeft,
				}
			}),
			takeUntil(didUnmount$)
		)
		.subscribe(style$)

	didMount$
		.pipe(
			switchMapTo(sendToContextMenuProvider.$.pipe(filter((v) => isNotNull(v.node)))),
			switchMapTo(
				merge(
					closeContextMenu.$,
					escPressed$,
					documentClicked$.pipe(
						withLatestFrom(deps$),
						filter(([e, [ref]]) => {
							const el = ref.current as HTMLDivElement
							const target = e.target as Element
							if (el.contains(target)) {
								return target.hasAttribute('data-close-ctx')
							} else {
								return e.button === 0
							}
						})
					)
				)
			),
			mapTo(null),
			takeUntil(didUnmount$)
		)
		.subscribe(node$)

	return { node$, style$ }
})
