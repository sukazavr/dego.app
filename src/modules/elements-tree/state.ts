import { merge, of } from 'rxjs'
import {
	distinctUntilChanged, map, scan, shareReplay, startWith, switchMap, withLatestFrom,
} from 'rxjs/operators'

import { actionsTree } from '../../generic/actions'
import { IElement, ROOT_ID } from '../../generic/states/elements'
import { stateElements$ } from '../../generic/states/state-app'
import { ca } from '../../generic/supply/action-helpers'
import { isArrayEqual } from '../../generic/supply/utils'
import {
	defaultDnDState, defaultElMeta, IDnDState, TCursorPosition, TElMeta, TTreeIndex,
} from './types'

export const tree$ = stateElements$.pipe(
	scan<
		{
			[id: string]: IElement
		},
		TTreeIndex
	>(
		([, prevPaths], elements) => {
			const nextPaths: { [id: string]: string[] } = {}
			const nextIndex: string[] = []
			const nextMaxDeep: { [id: string]: string } = {}
			const grab = (id: string, parentPath: string[], putIndex: boolean) => {
				const { children, isExpanded } = elements[id]
				const prevPath = prevPaths[id]
				const nextPath = [...parentPath, id]
				const path = prevPath && isArrayEqual(prevPath, nextPath) ? prevPath : nextPath
				if (putIndex) {
					nextPaths[id] = path
					nextIndex.push(id)
				}
				children.forEach((childID) => grab(childID, path, putIndex && isExpanded))
			}
			grab(ROOT_ID, [], true)
			nextIndex.forEach((id) => {
				const path = nextPaths[id]
				const maxDeep = path[path.length - 1]
				path.forEach((id) => {
					nextMaxDeep[id] = maxDeep
				})
			})
			return [nextIndex, nextPaths, nextMaxDeep]
		},
		[[], {}, {}]
	),
	startWith<TTreeIndex>([[], {}, {}]),
	shareReplay(1)
)

export const hoverElement = ca<string | null>()
export const hoveredID$ = hoverElement.$.pipe(startWith<string | null>(null), shareReplay(1))

export const focusedID$ = actionsTree.focus.$.pipe(
	map(({ id }) => id),
	startWith<string | null>(null),
	shareReplay(1)
)

export const setTreeEl = ca<HTMLDivElement | null>()
export const treeEl$ = setTreeEl.$.pipe(startWith<HTMLDivElement | null>(null), shareReplay(1))

export const elStore = new Map<string, HTMLDivElement>()

export const dndStartDragging = ca<string>()
export const dndEndDragging = ca()
export const draggingID$ = merge(dndStartDragging.$, dndEndDragging.$).pipe(
	map(() => null),
	startWith<string | null>(null),
	shareReplay(1)
)

export const dndSetCursorPosition = ca<TCursorPosition>()
export const dndCursorPosition$ = dndSetCursorPosition.$.pipe(
	startWith<TCursorPosition>(null),
	shareReplay(1)
)

export const dndHoverTarget = ca<string>()

export const dndState$ = treeEl$.pipe(
	switchMap((treeEl) => {
		if (treeEl) {
			return dndStartDragging.$.pipe(
				withLatestFrom(tree$),
				switchMap(([sourceID, [treeIndex, treePaths, treeMaxDeep]]) =>
					dndHoverTarget.$.pipe(
						distinctUntilChanged(),
						switchMap((targetID) => {
							const canDrop = !treePaths[targetID].includes(sourceID)
							const targetMeta = getElMeta(targetID)
							const rectTree = treeEl.getBoundingClientRect()
							const landingZone = targetID === ROOT_ID ? rectTree : targetMeta.rect
							return dndCursorPosition$.pipe(
								map((cursorPosition) => {
									if (canDrop && cursorPosition && landingZone) {
										const { x, y } = cursorPosition
										const { top, left, bottom, right } = landingZone
										if (
											// "Math.ceil(top) - 1 <= y" for skip 1px gap between elements
											(top <= y || Math.ceil(top) - 1 <= y) &&
											y <= bottom &&
											left <= x &&
											x <= right
										) {
											const s: IDnDState = {
												...defaultDnDState,
												sourceID,
												targetID,
												canDrop,
											}
											const dndTargetPath = treePaths[targetID]
											const dndTargetParent = dndTargetPath[dndTargetPath.length - 2]
											if (dndTargetParent) {
												const heightEdge = targetMeta.heightEdge
												if (y > bottom - heightEdge) {
													s.addBelow = true
													s.placeholderParentID = dndTargetParent
													const maxDeep = treeMaxDeep[targetID]
													const srcMeta =
														maxDeep === targetID ? targetMeta : getElMeta(maxDeep)
													const fromMeta = getElMeta(dndTargetParent)
													s.placeholderStyle = getPlaceholderStyle(
														rectTree,
														treeEl.scrollTop,
														srcMeta,
														fromMeta,
														'bottom'
													)
												} else if (y < top + heightEdge) {
													s.addAbove = true
													s.placeholderParentID = dndTargetParent
													s.placeholderStyle = getPlaceholderStyle(
														rectTree,
														treeEl.scrollTop,
														targetMeta,
														getElMeta(dndTargetParent),
														'top'
													)
												} else {
													s.addInside = true
													s.placeholderParentID = targetID
													const maxDeep = treeMaxDeep[targetID]
													const srcMeta =
														maxDeep === targetID ? targetMeta : getElMeta(maxDeep)
													s.placeholderStyle = getPlaceholderStyle(
														rectTree,
														treeEl.scrollTop,
														srcMeta,
														targetMeta,
														'bottom'
													)
												}
											} else {
												s.addInside = true
												s.placeholderParentID = targetID
												s.placeholderStyle = getPlaceholderStyle(
													rectTree,
													treeEl.scrollTop,
													getElMeta(treeIndex[treeIndex.length - 1]),
													targetMeta,
													'bottom'
												)
											}
											return s
										}
									}
									return defaultDnDState
								})
							)
						})
					)
				)
			)
		} else {
			return of(defaultDnDState)
		}
	}),
	distinctUntilChanged(),
	shareReplay(1)
)

export const placeholderParentID$ = dndState$.pipe(
	map(({ placeholderParentID }) => placeholderParentID),
	startWith<string | null>(null),
	shareReplay(1)
)

const getPlaceholderStyle = (
	rectTree: ClientRect,
	scrollTop: number,
	{ rect }: TElMeta,
	{ shift }: TElMeta,
	dir: 'top' | 'bottom'
) => {
	if (rect) {
		return {
			top: rect[dir] - rectTree.top + scrollTop,
			left: rect.left + shift - rectTree.left,
			width: rect.width - shift,
		}
	} else {
		return { ...defaultDnDState.placeholderStyle }
	}
}

const getElMeta = (elID: string): TElMeta => {
	const el = elStore.get(elID)
	if (el) {
		const rect = el.getBoundingClientRect()
		const tempEdge = Math.ceil(rect.height * 0.45)
		const tail = tempEdge % 2
		return {
			heightEdge: (tempEdge - tail) / 2,
			shift: parseFloat(getComputedStyle(el).paddingLeft as string),
			rect,
		}
	} else {
		return { ...defaultElMeta }
	}
}
