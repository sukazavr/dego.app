import React from 'react'
import { concat, merge, of } from 'rxjs'
import { filter, mapTo, switchMap, take } from 'rxjs/operators'

import { ca, TDummyAction } from '../../generic/supply/action-helpers'
import { documentClicked$, escPressed$ } from '../../generic/supply/rxjs-helpers'
import { contextMenuNode, sendToContextPlaceholder } from './state'

type TMenuMaker<T> = (props: {
	close: TDummyAction
	position: { top: number; left: number }
	payload: T
}) => React.ReactNode

export const useContextMenu = <T>(menuMaker: TMenuMaker<T>, deps: unknown[] = []) => {
	const controls = React.useMemo(
		() => ({
			close: ca(),
			open: ca<
				T,
				{ position: { left: number; top: number }; payload: T },
				(e: React.MouseEvent<any, MouseEvent>) => void
			>((R, payload) => (e) => {
				e.preventDefault()
				e.stopPropagation()
				R({ position: { left: e.pageX, top: e.pageY }, payload })
			}),
		}),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		deps
	)

	React.useEffect(() => {
		const sub = controls.open.$.pipe(
			switchMap((props) => {
				return concat(
					of(menuMaker({ close: controls.close, ...props })),
					merge(
						controls.close.$,
						escPressed$,
						documentClicked$.pipe(
							filter((e) => {
								const target = e.target as Element
								if (contextMenuNode.contains(target)) {
									return target.hasAttribute('data-close-ctx')
								} else {
									return e.button === 0
								}
							})
						)
					).pipe(
						take(1),
						mapTo(null)
					)
				)
			})
		).subscribe(sendToContextPlaceholder)
		return sub.unsubscribe.bind(sub)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [controls])

	return controls
}
