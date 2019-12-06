import React from 'react'
import { fromEvent, Subscription } from 'rxjs'
import { map, switchMap, takeUntil, withLatestFrom } from 'rxjs/operators'
import { style } from 'typestyle'
import { NestedCSSProperties } from 'typestyle/lib/types'

import { Atom } from '@grammarly/focal'

import { tv } from '../../generic/supply/style-helpers'

const MIN = 100
const move$ = fromEvent<MouseEvent>(document, 'mousemove')
const up$ = fromEvent<MouseEvent>(document, 'mouseup')

type TProps = {
	row?: boolean
	ward: Atom<number>
	area: string
}

export class Divider extends React.PureComponent<TProps> {
	private sub!: Subscription
	private ref = React.createRef<HTMLDivElement>()
	componentDidMount() {
		const { row, ward } = this.props
		const direction = row ? 'pageY' : 'pageX'
		const rectSize = row ? 'height' : 'width'
		const offsetSize = row ? 'offsetHeight' : 'offsetWidth'
		const offsetDirection = row ? 'offsetY' : 'offsetX'
		const el = this.ref.current as HTMLDivElement
		const parent = el.parentElement as HTMLDivElement
		this.sub = fromEvent<MouseEvent>(el, 'mousedown')
			.pipe(
				withLatestFrom(ward),
				switchMap(([downE, startedFrom]) => {
					const pos =
						Math.floor(el[offsetSize] / 2) - downE[offsetDirection] + downE[direction]
					const parentRect = parent.getBoundingClientRect()
					const max = parentRect[rectSize] - MIN
					const initialVal = startedFrom > max ? max : startedFrom
					return move$.pipe(
						map((moveE) => {
							moveE.preventDefault()
							const val = initialVal + moveE[direction] - pos
							return val >= MIN && val <= max ? val : null
						}),
						takeUntil(up$)
					)
				})
			)
			.subscribe((val) => {
				if (val !== null) {
					ward.set(val)
				}
			})
	}
	componentWillUnmount() {
		this.sub.unsubscribe()
	}
	render() {
		return (
			<div
				ref={this.ref}
				className={this.props.row ? $row : $col}
				style={{ gridArea: this.props.area }}
			/>
		)
	}
}

const common: NestedCSSProperties = {
	backgroundColor: tv('base900'),
	backgroundClip: 'content-box',
	zIndex: 1,
}

const $col = style(common, {
	cursor: 'col-resize',
	marginLeft: '-4px',
	width: '1px',
	padding: '0 4px',
})

const $row = style(common, {
	cursor: 'row-resize',
	marginTop: '-4px',
	height: '1px',
	padding: '4px 0',
})
