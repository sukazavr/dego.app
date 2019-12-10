import produce from 'immer'
import { merge, timer } from 'rxjs'
import { delay, filter, map, switchMap, takeUntil, tap } from 'rxjs/operators'

import { actionsTree } from '../../../generic/actions'
import { stateApp$, stateElements$, stateTree$ } from '../../../generic/states/state-app'
import { createUseWatcher } from '../../../generic/supply/react-helpers'
import { isNotNull, isTreeElement } from '../../../generic/supply/type-guards'
import { elStore } from '../common'
import { FLASH_DURATION } from '../Element/Element'
import {
	createTreeElement, mutateAddInside, mutateAddNeighbor, mutateRemoveFromParent,
	mutateRemoveFromTree,
} from '../utils'

export const useTreeEasyWatcher = createUseWatcher(({ didUnmount$ }) => {
	merge(
		actionsTree.addInside.$.pipe(
			tap(({ parentID }) => {
				const element = createTreeElement()
				stateApp$.modify((stateApp) => ({
					...stateApp,
					elements: produce(stateApp.elements, (draft) => {
						mutateAddInside(draft, element, parentID)
					}),
					tree: {
						...stateApp.tree,
						flashedID: element.id,
					},
				}))
			})
		),
		merge<[string, boolean], [string, boolean]>(
			actionsTree.addAbove.$.pipe(map(({ neighborID }) => [neighborID, false])),
			actionsTree.addBelow.$.pipe(map(({ neighborID }) => [neighborID, true]))
		).pipe(
			tap(([neighborID, after]) => {
				const element = createTreeElement()
				stateApp$.modify((stateApp) => ({
					...stateApp,
					elements: produce(stateApp.elements, (draft) => {
						mutateAddNeighbor(draft, element, neighborID, after)
					}),
					tree: {
						...stateApp.tree,
						flashedID: element.id,
					},
				}))
			})
		),
		actionsTree.delete.$.pipe(
			tap(({ id }) => {
				stateElements$.modify((elements) =>
					produce(elements, (draft) => {
						const element = draft[id]
						if (isTreeElement(element)) {
							mutateRemoveFromParent(draft, element)
							mutateRemoveFromTree(draft, element)
						}
					})
				)
			})
		),
		actionsTree.focus.$.pipe(
			tap(({ id }) => {
				const el = elStore.get(id)
				if (el) {
					stateTree$.lens('focusedID').set(id)
					const treeEl = el.parentElement as HTMLElement
					const parentScrollTop = treeEl.scrollTop
					const offsetDiff = el.offsetTop
					const overTop = offsetDiff < parentScrollTop
					const overBottom =
						offsetDiff + el.clientHeight > parentScrollTop + treeEl.clientHeight
					if (overTop || overBottom) {
						el.scrollIntoView()
					}
				}
			})
		),
		stateTree$.view('flashedID').pipe(
			filter<string | null, string>(isNotNull),
			switchMap((id) =>
				timer(100).pipe(
					tap(actionsTree.focus._({ id })),
					delay(FLASH_DURATION),
					tap(() => {
						stateTree$.lens('flashedID').set(null)
					})
				)
			)
		)
	)
		.pipe(takeUntil(didUnmount$))
		.subscribe()
})
