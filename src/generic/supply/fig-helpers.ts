import { defer, Observable, of, throwError, timer } from 'rxjs'
import { catchError, mergeMap, retryWhen, share, switchMap, takeUntil, tap } from 'rxjs/operators'

import { Atom } from '@grammarly/focal'

import { ca } from './action-helpers'

interface IFigTaskDesc<T1> {
	task: () => Promise<T1>
	attempts?: number
	onFinish?: (val: Error | T1) => void
}

enum EStatus {
	IDLE,
	ACTING,
	DONE,
}

interface IFigState {
	status: EStatus
	EStatus: typeof EStatus
}

const DEFAULT_NUMBER_OF_ATTEMPTS = 10

export const createFig = <TMeta>(meta: TMeta) => {
	const state$ = Atom.create<IFigState>({ EStatus, status: EStatus.IDLE })

	// Start task, status ACTING
	// If trig during ACTING it'll start whole proc over again
	let proxyRun: (taskDesc: IFigTaskDesc<any>) => void
	const run = <T1>(taskDesc: IFigTaskDesc<T1>) => proxyRun(taskDesc)
	run.$ = new Observable<IFigTaskDesc<any>>((sub) => {
		proxyRun = sub.next.bind(sub)
	}).pipe(share())

	// Abort task, status IDLE
	const abort = ca()

	run.$.pipe(
		tap(() => {
			const currentState = state$.get()
			if (currentState.status !== EStatus.ACTING) {
				state$.set({ ...currentState, status: EStatus.ACTING })
			}
		}),
		switchMap(({ task, attempts, onFinish }) => {
			const maxAttempts = attempts || DEFAULT_NUMBER_OF_ATTEMPTS
			return defer(task).pipe(
				takeUntil(abort.$),
				retryWhen((errors) =>
					errors.pipe(
						mergeMap((error, i) => {
							if (error.message === 'Failed to fetch') {
								return i < maxAttempts
									? timer((i < 7 ? (i + 1) * 2 : 60) * 1000)
									: throwError(error)
							}
							return throwError(error)
						})
					)
				),
				catchError((error: Error) => of(error)),
				tap((val) => onFinish && onFinish(val))
			)
		})
	).subscribe(() => {
		state$.modify((s) => ({ ...s, status: EStatus.DONE }))
	})

	abort.$.subscribe(() => {
		const currentState = state$.get()
		if (currentState.status !== EStatus.IDLE) {
			state$.set({ ...currentState, status: EStatus.IDLE })
		}
	})

	return {
		run,
		abort,
		meta$: Atom.create<TMeta>(meta),
		state$: state$.view(),
	}
}
