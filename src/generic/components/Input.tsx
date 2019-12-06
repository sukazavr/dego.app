import React from 'react'
import { classes, style } from 'typestyle'

import { tv, unitFont } from '../theme'

interface IProps extends React.InputHTMLAttributes<HTMLInputElement> {
	isInvalid?: boolean
}

export const Input = React.forwardRef<HTMLInputElement, IProps>(
	({ isInvalid = false, className, ...rest }, ref) => {
		return (
			<input
				type="text"
				{...rest}
				ref={ref}
				className={classes($container, isInvalid && $invalid, className)}
			/>
		)
	}
)

const $container = style(unitFont, {
	width: '100%',
	minWidth: '5rem',
	height: '26px',
	border: `1px solid ${tv('base500')}`,
	backgroundColor: tv('base'),
	color: tv('base500'),
	outline: 'none',
	padding: '0 6px',
	$nest: {
		'&:focus': {
			color: tv('select500'),
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
