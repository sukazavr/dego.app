import React from 'react'
import { style } from 'typestyle'

import { Atom } from '@grammarly/focal'

import { actionsTree } from '../../../generic/actions'
import { IElement } from '../../../generic/states/elements'
import { fontRegular } from '../../../generic/theme'

interface IProps {
	element$: Atom<IElement>
	element: IElement
}

export const ElementContentName = React.memo<IProps>(({ element, element$ }) => {
	const ref = React.useRef<HTMLInputElement>(null)
	return (
		<div className={$container} onDoubleClick={actionsTree.editName._({ id: element.id })}>
			<input
				type="text"
				ref={ref}
				className={$nameInput}
				value={element.name}
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
