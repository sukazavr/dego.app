import { Observable } from 'rxjs'

import { Atom, ReadOnlyAtom } from '@grammarly/focal'
import { TElementAny, IElementCanvas, CANVAS_ID, IElement, BODY_ID } from '../states/elements'

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
	return value === undefined
}

export function isDefined<T>(value: T): value is Exclude<T, undefined> {
	return value !== undefined
}

export function isNull(value: unknown): value is null {
	return value === null
}

export function isNotNull<T>(value: unknown): value is Exclude<T, null> {
	return value !== null
}

export function isPresent<T>(value: T): value is Exclude<T, undefined | null> {
	return value !== undefined && value !== null
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

export function isNotElementCanvas(value: TElementAny): value is Exclude<TElementAny, IElementCanvas> {
	return value.id !== CANVAS_ID
}

export function isTreeElement(value: TElementAny): value is IElement {
	return value.id !== CANVAS_ID && value.id !== BODY_ID
}