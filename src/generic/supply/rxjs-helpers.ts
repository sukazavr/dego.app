import { fromEvent, throwError, timer } from 'rxjs'
import { filter, mergeMap, retryWhen, share, tap } from 'rxjs/operators'

// 60 attempts its ~1h and 1m
export const retryStrategy = <T>(maxAttempts = 60) => {
	return retryWhen<T>((attempts) =>
		attempts.pipe(
			mergeMap((error, i) =>
				i < maxAttempts ? timer((i < 7 ? (i + 1) * 2 : 60) * 1000) : throwError(error)
			)
		)
	)
}

export const documentClicked$ = fromEvent<MouseEvent>(document, 'click').pipe(share())

export const escPressed$ = fromEvent<KeyboardEvent>(document, 'keydown').pipe(
	filter((e) => e.keyCode === 27),
	share()
)

export const debug = (...args: any[]) => <T>(stream: T): T =>
	(stream as any).pipe(tap(console.log.bind(console, ...args)))
