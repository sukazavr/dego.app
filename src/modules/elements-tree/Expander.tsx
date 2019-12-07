import React from 'react'
import { classes, style } from 'typestyle'

import { Atom } from '@grammarly/focal'

import { IElement } from '../../generic/states/elements'
import { useObservable } from '../../generic/supply/react-helpers'

interface IProps {
	element$: Atom<IElement>
}

export const Expander = React.memo<IProps>(({ element$ }) => {
	const toggle = React.useCallback(() => {
		element$.modify((_) => ({ ..._, isExpanded: !_.isExpanded }))
	}, [element$])
	const { children, isExpanded } = useObservable(element$)
	const hasChildren = Boolean(children.length)
	const classNameIco = hasChildren ? classes($triangle, isExpanded && $expanded) : $dot
	return (
		<div className={$container} onClick={hasChildren ? toggle : undefined}>
			<div className={classNameIco} />
		</div>
	)
})

const $container = style({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	width: '1.6em',
	height: '1.6em',
})

const $dot = style({
	width: '4px',
	height: '4px',
	borderRadius: '50%',
	backgroundColor: 'rgba(255, 255, 255, 0.1)',
})

const $triangle = style({
	borderWidth: '0.3076923076923077em 0.3076923076923077em 0',
	borderStyle: 'solid',
	borderColor: 'rgba(255, 255, 255, 0.4) transparent transparent',
	transform: 'rotate(-90deg)',
	transitionDuration: '120ms',
	transitionProperty: 'border, transform',
})

const $expanded = style({
	borderColor: '#fff transparent transparent',
	transform: 'rotate(0)',
})
