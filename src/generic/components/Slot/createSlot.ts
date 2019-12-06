import React from 'react'
import { BehaviorSubject } from 'rxjs'

import { useObservable } from '../../supply/react-helpers'

export const createSlot = <T extends object>(
	Component: React.ComponentType<T>
): [React.FC, React.FC, React.FC<T>] => {
	const SlotContext = React.createContext<{
		props$: BehaviorSubject<React.Attributes>
	}>({
		props$: new BehaviorSubject<React.Attributes>({}),
	})
	const SlotProvider = React.memo(({ children }) => {
		return React.createElement(SlotContext.Provider, {
			value: {
				props$: new BehaviorSubject({}),
			},
			children,
		})
	})
	const Slot = React.memo(() => {
		const { props$ } = React.useContext(SlotContext)
		const props: any = useObservable(props$)
		return React.createElement(Component, props)
	})
	const SlotLift = React.memo<T>((props: T) => {
		const { props$ } = React.useContext(SlotContext)
		props$.next(props)
		return null
	})
	return [SlotProvider, Slot, SlotLift]
}
