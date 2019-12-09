import React from 'react'
import { classes, style } from 'typestyle'

import { fontRegular } from '../../generic/theme'

interface IMenuItemProps extends React.HTMLProps<HTMLDivElement> {
	isActive?: boolean
}

export const MenuItem = React.memo<IMenuItemProps>(({ children, isActive, ...rest }) => (
	<div className={classes($item, isActive && $itemActive)} data-close-ctx {...rest}>
		{children}
	</div>
))

const $item = style(fontRegular, {
	color: '#e2e2e2',
	borderRadius: '0.2em',
	padding: '0.2em 0.4em',
	cursor: 'default',
	userSelect: 'none',
	$nest: {
		'&:hover': {
			color: '#fff',
			backgroundColor: '#0063ff',
		},
	},
})

const $itemActive = style({
	backgroundColor: 'rgba(0, 255, 90, 0.4)',
})
