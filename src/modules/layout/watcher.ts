import { debounceTime, switchMapTo, takeUntil } from 'rxjs/operators'

import { stateLayout$ } from '../../generic/states/state-app'
import { createUseWatcher } from '../../generic/supply/react-helpers'

const LS_LAYOUT = '_!LAYOUT!_'

export const useLayoutWatcher = createUseWatcher(({ didMount$, didUnmount$ }) => {
	try {
		const LSLayout = localStorage.getItem(LS_LAYOUT)
		const ParsedLayout = LSLayout && JSON.parse(LSLayout)

		if (ParsedLayout) {
			stateLayout$.set(ParsedLayout)
		}
	} catch (error) {}

	didMount$
		.pipe(switchMapTo(stateLayout$.pipe(debounceTime(500))), takeUntil(didUnmount$))
		.subscribe((stateLayout) => {
			localStorage.setItem(LS_LAYOUT, JSON.stringify(stateLayout))
		})

	const style$ = stateLayout$.view(({ treePanelWidth, nodePanelWidth }) => ({
		gridTemplateColumns: `${treePanelWidth}px ${nodePanelWidth}px minmax(0, 1fr)`,
		gridTemplateRows: `minmax(0, 1fr)`,
	}))

	return style$
})
