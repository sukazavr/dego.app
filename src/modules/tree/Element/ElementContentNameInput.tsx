import React from 'react'
import { style } from 'typestyle'

import { tv } from '../../../generic/supply/style-helpers'
import { fontRegular } from '../../../generic/theme'

interface IProps {
	defaultValue: string
	onCommit: (nextName: string) => void
}

export const ElementContentNameInput = React.memo<IProps>(({ defaultValue, onCommit }) => {
	const [name, setName] = React.useState(defaultValue)
	const commit = React.useCallback(() => {
		onCommit(name.trim())
	}, [onCommit, name])
	const keyDown = React.useCallback(
		(e: React.KeyboardEvent<HTMLInputElement>) => {
			if (e.keyCode === 13) {
				e.preventDefault()
				commit()
			} else if (e.keyCode === 27) {
				onCommit(defaultValue)
			}
		},
		[onCommit, defaultValue, commit]
	)
	const change = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		setName(e.target.value)
	}, [])
	const focus = React.useCallback((e: React.FocusEvent<HTMLInputElement>) => {
		e.target.select()
	}, [])
	const ctxMenu = React.useCallback((e: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
		e.stopPropagation()
	}, [])
	return (
		<input
			type="text"
			className={$nameInput}
			value={name}
			onKeyDown={keyDown}
			onChange={change}
			onBlur={commit}
			autoFocus
			onFocus={focus}
			onContextMenu={ctxMenu}
		/>
	)
})

const $nameInput = style(fontRegular, {
	flex: '1 1 0',
	width: 0,
	border: 0,
	padding: '.25em .2em',
	marginRight: '0.1em',
	backgroundColor: tv('base'),
	outline: 'none',
	color: tv('base900'),
})
