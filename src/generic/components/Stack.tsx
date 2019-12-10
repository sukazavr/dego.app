import React from 'react'
import { classes, style, types } from 'typestyle'

import { gridSpaced, horizontalSpaced, verticalSpaced } from '../supply/style-helpers'

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
	isInline?: boolean
	isWrap?: boolean
	isCentered?: boolean
	spacing?: number | string
}

export const Stack = React.memo<IProps>(
	({ isInline = false, isWrap = false, isCentered = false, spacing = 0, className, ...rest }) => {
		const baseStyle: types.NestedCSSProperties = {
			display: 'flex',
		}
		const spaced = isWrap ? gridSpaced : isInline ? horizontalSpaced : verticalSpaced
		if (isWrap) {
			baseStyle.flexWrap = 'wrap'
		}
		if (!isInline) {
			baseStyle.flexDirection = 'column'
		}
		if (isCentered) {
			baseStyle.alignItems = 'center'
		}
		return <div className={classes(style(spaced(spacing), baseStyle), className)} {...rest} />
	}
)
