import React from 'react'
import { cssRule } from 'typestyle'

import { ContextMenuProvider } from '../context-menu/ContextMenuProvider'
import { Layout } from '../layout/Layout'
import { useShellWatcher } from './watcher'

const Shell: React.FC = () => {
	useShellWatcher()
	return (
		<>
			<Layout />
			<ContextMenuProvider />
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
