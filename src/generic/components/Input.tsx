import React from 'react'
import { classes, style } from 'typestyle'

import { tv } from '../supply/style-helpers'
import { fontUnit } from '../theme'

interface IProps extends React.InputHTMLAttributes<HTMLInputElement> {
	isInvalid?: boolean
	maxWidth?: keyof typeof maxWidthGrad
}

export const Input = React.forwardRef<HTMLInputElement, IProps>(
	({ isInvalid = false, maxWidth: mw, className, style, ...rest }, ref) => {
		const maxWidth = mw && maxWidthGrad[mw]
		return (
			<input
				type="text"
				{...rest}
				ref={ref}
				className={classes($container, isInvalid && $invalid, className)}
				style={{ maxWidth, ...style }}
			/>
		)
	}
)

const maxWidthGrad = {
	s: '9rem',
}

const $container = style(fontUnit, {
	width: '100%',
	minWidth: '5rem',
	height: '3.25rem',
	boxSizing: 'border-box',
	border: `1px solid ${tv('base500')}`,
	backgroundColor: tv('base'),
	color: tv('base500'),
	outline: 'none',
	padding: '0 .5rem',
	$nest: {
		'&:focus': {
			color: tv('base900'),
			borderColor: tv('select500'),
		},
		'&::placeholder': {
			color: tv('base300'),
		},
	},
})

const $invalid = style({
	borderColor: tv('error500'),
})
