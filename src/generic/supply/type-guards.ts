import { Observable } from 'rxjs'

import { Atom, ReadOnlyAtom } from '@grammarly/focal'

export function isAnyAtom<T>(value: unknown): value is Atom<T> | ReadOnlyAtom<T> {
	return value instanceof Observable && isFunction((value as any).view)
}

export function isAtom<T>(value: unknown): value is Atom<T> {
	return isAnyAtom(value) && isFunction((value as any).set)
}

export function isReadOnlyAtom<T>(value: unknown): value is ReadOnlyAtom<T> {
	return isAnyAtom(value) && isUndefined((value as any).set)
}

// tslint:disable-next-line: ban-types
export function isFunction(value: unknown): value is Function {
	return typeof value === 'function'
}

export function isUndefined(value: unknown): value is undefined {
	return typeof value === 'undefined'
}

export function isError(value: unknown): value is Error {
	const tag = toString.call(value)
	switch (tag) {
		case '[object Error]':
			return true
		case '[object Exception]':
			return true
		case '[object DOMException]':
			return true
		default:
			return value instanceof Error
	}
}
