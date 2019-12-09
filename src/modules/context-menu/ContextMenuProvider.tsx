import React from 'react'
import ReactDOM from 'react-dom'

import { MenuContainer } from './MenuContainer'

export const ContextMenuProvider = React.memo(() =>
	ReactDOM.createPortal(<MenuContainer />, document.body)
)
