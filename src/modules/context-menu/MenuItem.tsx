import React from 'react'
import { classes, style } from 'typestyle'

import { tv } from '../../generic/supply/style-helpers'
import { fontRegularBig } from '../../generic/theme'

interface IMenuItemProps extends React.HTMLProps<HTMLDivElement> {
	isActive?: boolean
}

export const MenuItem = React.memo<IMenuItemProps>(({ children, isActive, ...rest }) => (
	<div className={classes($item, isActive && $active)} data-close-ctx {...rest}>
		{children}
	</div>
))

const $item = style(fontRegularBig, {
	padding: '.5rem 1rem',
	color: tv('base500'),
	cursor: 'default',
	userSelect: 'none',
	$nest: {
		'&:hover': {
			color: tv('base900'),
			backgroundColor: tv('select100'),
		},
	},
})

const $active = style({
	color: tv('base'),
	backgroundColor: tv('select500'),
})
