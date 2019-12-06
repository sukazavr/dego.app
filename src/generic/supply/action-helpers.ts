import { Observable, Subject } from 'rxjs'

let actionCounter: number = 0

// Create Action
export function ca(): TDummyAction
export function ca<A>(): TAction<A>
export function ca<A, P, C>(modifier: TModifier<A, P, C>): TAction<A, P, C>
export function ca<A, P, C>(modifier?: TModifier<A, P, C>): TAction<A, P, C> {
	const $ = new Subject<P>()
	const next = $.next.bind($)
	const action = (payload: any) => {
		if (typeof modifier === 'function') {
			return modifier(next, payload)
		} else {
			return next(payload)
		}
	}
	action.id = `A#${++actionCounter}`
	action._ = (payload: any) => () => action(payload)
	action.$ = $
	return action as any
}

// Generalize Actions
export const ga = <Actions>(namespace: string, actions: { [K in keyof Actions]: Actions[K] }) => {
	Object.entries<any>(actions).forEach(([key, action]) => {
		action.$.subscribe((payload: any) => {
			generalActionLog({
				action,
				key,
				namespace,
				payload,
			})
		})
	})
	return actions
}

const generalActionLog = ca<IActionDust>()

export const generalActionsLog$ = generalActionLog.$

type TModifier<A, P, C> = (R: (payload: P) => void, a: A) => C

type TAction<A, P = A, C = void> = {
	(args: A): C
	id: string
	_: (args: A) => () => C
	$: Observable<P>
}

export type TDummyAction = {
	(...args: any[]): void
	id: string
	_: (...args: any[]) => () => void
	$: Observable<any>
}

export interface IActionDust {
	action: TDummyAction
	key: string
	namespace: string
	payload: any
}

/* const d = ca()
d()
d.$

const dd = ca<string>()
dd('h')
dd._('h')() // currying
dd.$

const dd2 = ca<string, number, (x: number) => void>((R, smth) => (x) => R(x + Number(smth)))
dd2.$
const h2 = dd2('df')
h2(3)

const tt = ga('tool', {
	d,
	dd,
	dd2,
}) */
