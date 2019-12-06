import React from 'react'
import { style } from 'typestyle'

export const MenuButton: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
	<div {...props} className={$menuBtn}>
		<svg
			width="3"
			height="13"
			viewBox="0 0 3 13"
			fill="currentColor"
			xmlns="http://www.w3.org/2000/svg"
		>
			<rect width="3" height="3" />
			<rect y="5" width="3" height="3" />
			<rect y="10" width="3" height="3" />
		</svg>
	</div>
)
const $menuBtn = style({
	width: '11px',
	backgroundColor: '#7e7e7e',
	color: 'rgba(255, 255, 255, 0.3)',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	cursor: 'pointer',
})
