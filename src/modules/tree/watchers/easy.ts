import produce from 'immer'
import { merge } from 'rxjs'
import { takeUntil, tap } from 'rxjs/operators'

import { actionsTree } from '../../../generic/actions'
import { stateElements$, stateTree$ } from '../../../generic/states/state-app'
import { createUseWatcher } from '../../../generic/supply/react-helpers'
import { createTreeElement, mutateAddInside } from '../utils'

export const useTreeEasyWatcher = createUseWatcher(({ didUnmount$ }) => {
	merge(
		actionsTree.addInside.$.pipe(
			tap(({ parentID }) => {
				const element = createTreeElement()
				stateElements$.modify((elements) =>
					produce(elements, (draft) => {
						mutateAddInside(draft, element, parentID)
					})
				)
				/* flashElement(element.id) */
			})
		),
		actionsTree.focus.$.pipe(
			tap(({ id }) => {
				stateTree$.lens('focusedID').set(id)
			})
		)
	)
		.pipe(takeUntil(didUnmount$))
		.subscribe()
})
