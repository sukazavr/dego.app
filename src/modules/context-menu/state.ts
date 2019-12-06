import React from 'react'

import { ca } from '../../generic/supply/action-helpers'

export const contextMenuNode = document.createElement('div')

export const sendToContextPlaceholder = ca<React.ReactNode>()

// Init
document.body.appendChild(contextMenuNode)
