import React from 'react'
import { cssRule } from 'typestyle'

import { ContextMenuPlaceholder } from '../context-menu/ContextMenuPlaceholder'
import { Layout } from '../layout/Layout'
import { useShellEpic } from './epic'

const Shell: React.FC = () => {
	useShellEpic()
	return (
		<>
			<Layout />
			<ContextMenuPlaceholder />
		</>
	)
}

export const App = Shell

cssRule('body', {
	display: 'flex',
	contain: 'strict',
	overflow: 'hidden',
	overscrollBehavior: 'none',
})

cssRule('#root', {
	flexGrow: 1,
	display: 'flex',
	flexDirection: 'column',
	overflowY: 'auto',
})
