import { useEffect, useLayoutEffect, useMemo, useState } from 'react'
import { BehaviorSubject, Observable, Subscription } from 'rxjs'
import { distinctUntilChanged } from 'rxjs/operators'

import { Atom, ReadOnlyAtom } from '@grammarly/focal'

import { isAnyAtom, isUndefined } from './type-guards'

export function setRef<T>(
	ref: React.RefObject<T> | ((instance: T | null) => void) | null | undefined,
	value: T | null
): void {
	if (typeof ref === 'function') {
		ref(value)
	} else if (ref) {
		;(ref as any).current = value
	}
}

export function useForkRef<T>(refA: React.Ref<T>, refB: React.Ref<T>): React.Ref<T> {
	return useMemo(() => {
		if (refA == null && refB == null) {
			return null
		}
		return (refValue) => {
			setRef(refA, refValue)
			setRef(refB, refValue)
		}
	}, [refA, refB])
}

export const useEnhancedEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

type TDidMount = (getSubs: () => Subscription[]) => void

export function createUseEpic<TCreate extends (didMount: TDidMount) => any>(
	create: TCreate
): () => ReturnType<TCreate>
export function createUseEpic<TDeps extends unknown[], TReturn>(
	create: (didMount: TDidMount, deps: TDeps) => TReturn
): (deps: TDeps) => TReturn
export function createUseEpic<TDeps extends unknown[], TReturn>(
	create: (didMount: TDidMount, deps?: TDeps) => TReturn
): (deps?: TDeps) => TReturn {
	return (deps) => {
		const { subscribe, res } = useMemo<{
			subscribe: () => Subscription[]
			res: any
		}>(() => {
			let subscribe: (() => Subscription[]) | null = null
			const didMount: TDidMount = (getSubs) => (subscribe = getSubs)
			const res = create(didMount, deps)
			if (subscribe === null) {
				throw new Error('didMount must be synchronously called inside createUseEpic')
			}
			return { subscribe, res }
			// eslint-disable-next-line
		}, deps || [])
		useEnhancedEffect(() => {
			const subs = subscribe()
			return () => subs.forEach((sub) => sub.unsubscribe())
		}, [subscribe])
		return res
	}
}

export function useObservable<T>($: BehaviorSubject<T> | Atom<T> | ReadOnlyAtom<T>): T
export function useObservable<T>($: Observable<T>): T | null
export function useObservable<T>($: Observable<T>, defaultValue: T): T
export function useObservable<T>($: Observable<T>, defaultValue?: T) {
	let initialValue: T | null
	// The conditions order matters
	if (isAnyAtom<T>($)) {
		initialValue = $.get()
	} else if ($ instanceof BehaviorSubject) {
		initialValue = $.getValue()
	} else {
		initialValue = isUndefined(defaultValue) ? null : defaultValue
	}
	const [value, setValue] = useState(initialValue)
	useEffect(() => {
		const sub = $.pipe(distinctUntilChanged()).subscribe((nextValue) => {
			setValue(() => nextValue)
		})
		return () => sub.unsubscribe()
	}, [$])
	return value
}
