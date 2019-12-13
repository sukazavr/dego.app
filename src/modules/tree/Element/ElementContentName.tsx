import React from 'react'
import { filter } from 'rxjs/operators'
import { style } from 'typestyle'

import { Atom } from '@grammarly/focal'

import { actionsTree } from '../../../generic/actions'
import { BODY_ID, TElementAny } from '../../../generic/states/elements'
import { useEnhancedEffect, useObservableFabric } from '../../../generic/supply/react-helpers'
import { isNotElementCanvas } from '../../../generic/supply/type-guards'
import { fontRegular } from '../../../generic/theme'
import { ElementContentNameInput } from './ElementContentNameInput'

interface IProps {
	element$: Atom<TElementAny>
	id: string
}

export const ElementContentName = React.memo<IProps>(({ id, element$ }) => {
	const [isEditing, setIsEditing] = React.useState(false)
	const name = useObservableFabric(
		() =>
			element$.view((element) => {
				if (isNotElementCanvas(element)) {
					return element.name || (element.id === BODY_ID ? 'Body' : element.type)
				} else {
					return 'Canvas'
				}
			}),
		[element$]
	)
	const onCommit = React.useCallback(
		(nextName: string) => {
			element$.modify((_) => {
				if (isNotElementCanvas(_)) {
					return { ..._, name: nextName }
				} else {
					return _
				}
			})
			setIsEditing(false)
		},
		[element$]
	)
	useEnhancedEffect(() => {
		const sub = actionsTree.editName.$.pipe(filter((_) => _.id === id)).subscribe(() => {
			setIsEditing(true)
		})
		return () => sub.unsubscribe()
	}, [id])
	return (
		<div className={$container} onDoubleClick={actionsTree.editName._({ id })}>
			{isEditing ? (
				<ElementContentNameInput defaultValue={name} onCommit={onCommit} />
			) : (
				<div className={$name}>{name}</div>
			)}
		</div>
	)
})

const $container = style({
	flexGrow: 1,
	display: 'flex',
	height: '3rem',
	alignItems: 'center',
})

const $name = style(fontRegular, {
	padding: '0 .2em',
	whiteSpace: 'nowrap',
})
