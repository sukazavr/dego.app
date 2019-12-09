import React from 'react'
import { map } from 'rxjs/operators'

import { ca, TDummyAction } from '../../generic/supply/action-helpers'
import { useEnhancedEffect } from '../../generic/supply/react-helpers'
import { closeContextMenu, sendToContextMenuProvider } from './state'

type TMenuMaker<T> = (props: { close: TDummyAction; payload: T }) => React.ReactNode

export const useContextMenu = <T>(menuMaker: TMenuMaker<T>, deps: unknown[] = []) => {
	const controls = React.useMemo(
		() => ({
			close: closeContextMenu,
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
		[]
	)

	useEnhancedEffect(() => {
		const sub = controls.open.$.pipe(
			map(({ payload, position }) => ({
				node: menuMaker({ close: controls.close, payload }),
				position,
			}))
		).subscribe(sendToContextMenuProvider)
		return sub.unsubscribe.bind(sub)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [deps])

	return controls
}
