import React from 'react'
import { fromEvent } from 'rxjs'
import { switchMap, switchMapTo, takeUntil, tap } from 'rxjs/operators'

import { Atom, ReadOnlyAtom } from '@grammarly/focal'

import { stateLayout$ } from '../../generic/states/state-app'
import { createUseWatcher } from '../../generic/supply/react-helpers'

export const usePreviewWatcher = createUseWatcher<
	[React.RefObject<HTMLDivElement>],
	ReadOnlyAtom<{
		width: number
		height: number
	}>
>(({ didMount$, didUnmount$, deps$ }) => {
	const move$ = fromEvent<MouseEvent>(document, 'mousemove')
	const up$ = fromEvent<MouseEvent>(document, 'mouseup')

	const canvasStyle$ = Atom.combine(
		stateLayout$.view('canvasWidth'),
		stateLayout$.view('canvasHeight'),
		(w, h) => ({
			width: w.n,
			height: h.n,
		})
	)

	didMount$
		.pipe(
			switchMapTo(deps$),
			switchMap(([ref]) => {
				const el = ref.current as HTMLDivElement
				return fromEvent<MouseEvent>(el, 'mousedown').pipe(
					switchMap((downE) => {
						const maxX = el.scrollWidth
						const maxY = el.scrollHeight
						const initialLeft = el.scrollLeft
						const initialTop = el.scrollTop
						const initialX = downE.pageX
						const initialY = downE.pageY
						return move$.pipe(
							tap((moveE) => {
								moveE.preventDefault()
								const nextX = initialLeft + initialX - moveE.pageX
								const nextY = initialTop + initialY - moveE.pageY
								el.scrollLeft = nextX < 0 ? 0 : nextX > maxX ? maxX : nextX
								el.scrollTop = nextY < 0 ? 0 : nextY > maxY ? maxY : nextY
							}),
							takeUntil(up$)
						)
					})
				)
			}),
			takeUntil(didUnmount$)
		)
		.subscribe()

	return canvasStyle$
})
