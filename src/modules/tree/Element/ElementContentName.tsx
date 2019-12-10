import React from 'react'
import { style } from 'typestyle'

import { Atom } from '@grammarly/focal'

import { actionsTree } from '../../../generic/actions'
import { BODY_ID, TElementAny } from '../../../generic/states/elements'
import { useObservableFabric } from '../../../generic/supply/react-helpers'
import { isNotElementCanvas } from '../../../generic/supply/type-guards'
import { fontRegular } from '../../../generic/theme'

interface IProps {
	element$: Atom<TElementAny>
	id: string
}

export const ElementContentName = React.memo<IProps>(({ id, element$ }) => {
	const ref = React.useRef<HTMLInputElement>(null)
	const name = useObservableFabric(
		() =>
			element$.view((element) => {
				if (isNotElementCanvas(element)) {
					return element.name || element.id === BODY_ID ? 'Body' : element.type
				} else {
					return 'Canvas'
				}
			}),
		[]
	)
	return (
		<div className={$container} onDoubleClick={actionsTree.editName._({ id })}>
			<input
				type="text"
				ref={ref}
				className={$nameInput}
				value={name}
				disabled={true}
				/* onKeyDown={this.keyDown}
				onChange={this.change}
				onBlur={this.commit} */
			/>
		</div>
	)
})

const $container = style({
	flexGrow: 1,
	display: 'flex',
})

const $nameInput = style(fontRegular, {
	flex: '1 1 0',
	width: 0,
	border: 0,
	lineHeight: 1.4,
	borderRadius: '.2em',
	backgroundColor: '#fff',
	color: '#000',
	outline: 'none',
	$nest: {
		'&[disabled]': {
			backgroundColor: 'transparent',
			color: 'inherit',
		},
	},
})
