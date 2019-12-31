/* eslint-disable @typescript-eslint/no-explicit-any */
import { Observable } from 'rxjs';

import { Atom, ReadOnlyAtom } from '@grammarly/focal';

import {
    BODY_ID, CANVAS_ID, IElementCanvas, IElementGeneric, TElementAny,
} from '../states/elements';

type Maybe<T> = T | null | undefined | unknown;

type ObjectCheck<T> = T extends object ? T : Record<any, unknown>;

type ExtractPlus<T, U, K> = any extends T ? K : T extends U ? T : K;

export function isAnyAtom<T>(value: unknown): value is Atom<T> | ReadOnlyAtom<T> {
  return value instanceof Observable && isFunction((value as any).view);
}

export function isAtom<T>(value: unknown): value is Atom<T> {
  return isAnyAtom(value) && isFunction((value as any).set);
}

export function isReadOnlyAtom<T>(value: unknown): value is ReadOnlyAtom<T> {
  return isAnyAtom(value) && isUndefined((value as any).set);
}

// tslint:disable-next-line: ban-types
export function isFunction(value: unknown): value is Function {
  return typeof value === 'function';
}

export function isUndefined(value: unknown): value is undefined {
  return value === undefined;
}

export function isDefined<T>(value: T): value is Exclude<T, undefined> {
  return value !== undefined;
}

export function isNull(value: unknown): value is null {
  return value === null;
}

export function isNotNull<T>(value: T): value is Exclude<T, null> {
  return value !== null;
}

export function isPresent<T>(value: T): value is NonNullable<T> {
  return value !== undefined && value !== null;
}

export function isError(value: unknown): value is Error {
  const tag = toString.call(value);
  switch (tag) {
    case '[object Error]':
      return true;
    case '[object Exception]':
      return true;
    case '[object DOMException]':
      return true;
    default:
      return value instanceof Error;
  }
}

export function isArray<T>(
  value: T | unknown[]
): value is ExtractPlus<T, any[] | ReadonlyArray<any>, unknown[]> {
  return Array.isArray(value);
}

// http://jsperf.com/isobject4
export function isObject<T extends Maybe<{}>>(value: T): value is ObjectCheck<NonNullable<T>> {
  return value !== null && typeof value === 'object';
}

export function isNumber(value: unknown): value is number {
  return typeof value === 'number';
}

export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

export function isText(value: unknown): value is string {
  return isString(value) && value !== '';
}

export function isNotText<T>(value: T): value is Exclude<T, string> {
  return !isText(value);
}

export function isElementGenericOrBody(
  value: TElementAny
): value is Exclude<TElementAny, IElementCanvas> {
  return value.id !== CANVAS_ID;
}

export function isElementGeneric(value: TElementAny): value is IElementGeneric {
  return value.id !== CANVAS_ID && value.id !== BODY_ID;
}
