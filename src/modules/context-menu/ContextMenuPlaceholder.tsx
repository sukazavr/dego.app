import React from 'react'
import { map } from 'rxjs/operators'

import { Portal } from '../../generic/components/Portal'
import { useObservable } from '../../generic/supply/react-helpers'
import { contextMenuNode, sendToContextPlaceholder } from './state'

export const ContextMenuPlaceholder = React.memo(() =>
	useObservable(
		sendToContextPlaceholder.$.pipe(
			map((node) =>
				node === null ? null : <Portal container={contextMenuNode} children={node} />
			)
		)
	)
)
