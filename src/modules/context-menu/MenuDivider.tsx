import React from 'react'
import { style } from 'typestyle'

export const MenuDivider: React.FC = () => <div className={$divider} />

const $divider = style({
	borderBottom: '1px solid #2f2f2f',
	borderTop: '1px solid #000',
	margin: '0.4em 0',
})
