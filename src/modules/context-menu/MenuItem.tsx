import React from 'react'
import { classes, style } from 'typestyle'

type TMenuItemProps = React.HTMLProps<HTMLDivElement> & {
	active?: boolean
}
export const MenuItem: React.FC<TMenuItemProps> = ({ children, active, ...props }) => (
	<div className={classes($item, active && $itemActive)} data-close-ctx {...props}>
		{children}
	</div>
)
const $item = style({
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
