import React from 'react'
import { classes, style } from 'typestyle'

import { applyVariables, tv } from '../supply/style-helpers'
import { Label } from './Label'

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
	title: string
	isTransparent?: boolean
}

export const Panel = React.forwardRef<HTMLDivElement, IProps>(
	({ title, isTransparent = false, children, className, ...rest }, ref) => {
		return (
			<div
				{...rest}
				ref={ref}
				className={classes($container, isTransparent && $isTransparent, className)}
			>
				<Label children={title} className={$title} />
				{children}
			</div>
		)
	}
)

const $container = style(
	applyVariables({
		'color-bg': tv('base100'),
	}),
	{
		display: 'flex',
		alignItems: 'center',
		padding: '0 1rem',
		minHeight: '3.25rem',
		backgroundColor: 'var(--color-bg)',
	}
)

const $isTransparent = style(
	applyVariables({
		'color-bg': 'transparent',
	})
)

const $title = style({
	flexGrow: 1,
})