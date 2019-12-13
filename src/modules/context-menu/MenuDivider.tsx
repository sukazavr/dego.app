import React from 'react'
import { style } from 'typestyle'

import { tv } from '../../generic/supply/style-helpers'

export const MenuDivider: React.FC = () => <div className={$divider} />

const $divider = style({
	borderTop: `1px solid ${tv('base900')}`,
	margin: '.5rem 0',
})
