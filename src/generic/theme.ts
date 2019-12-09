import { px } from 'csx'
import { NestedCSSProperties } from 'typestyle/lib/types'

import { tv } from './supply/style-helpers'
import { fontWeights, monoFontFamily, regularFontFamily, themeVariables } from './tokens'

// Init
if (window) {
	const rootStyle = window.document.documentElement.style
	Object.entries(themeVariables).forEach(([name, val]) => {
		rootStyle.setProperty(`--${name}`, val)
	})
}

export const fontRegular: NestedCSSProperties = {
	fontFamily: regularFontFamily,
	fontStyle: 'normal',
	fontWeight: fontWeights.normal,
	fontSize: px(12),
	lineHeight: px(14),
}

export const fontRegularBig: NestedCSSProperties = {
	...fontRegular,
	fontSize: px(14),
	lineHeight: px(16),
}

export const fontUnit: NestedCSSProperties = {
	...fontRegular,
	fontFamily: monoFontFamily,
}

export const scrollRegular: NestedCSSProperties = {
	$nest: {
		'&::-webkit-scrollbar': {
			width: '.5rem',
			height: '.5rem',
		},
		'&::-webkit-scrollbar-corner': {
			backgroundColor: 'transparent',
		},
		'&::-webkit-scrollbar-track': {
			borderTop: `1px solid ${tv('base900')}`,
			borderLeft: `1px solid ${tv('base900')}`,
		},
		'&:hover::-webkit-scrollbar-thumb': {
			backgroundColor: tv('base900'),
		},
	},
}
