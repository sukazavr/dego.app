import React from 'react'
import { DndProvider } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import { cssRule } from 'typestyle'

import { ContextMenuPlaceholder } from '../context-menu/ContextMenuPlaceholder'
import { Layout } from '../layout/Layout'
import { useShellEpic } from './epic'

const Shell: React.FC = () => {
	useShellEpic()
	return (
		<DndProvider backend={HTML5Backend}>
			<Layout />
			<ContextMenuPlaceholder />
		</DndProvider>
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
