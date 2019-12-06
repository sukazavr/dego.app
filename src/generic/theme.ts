import { em, px } from 'csx'
import { NestedCSSProperties } from 'typestyle/lib/types'

export const lightTheme = {
	base: '#fff',
	base100: '#F2F2F2',
	base300: '#A6A6A6',
	base500: '#404040',
	base900: '#000000',
	select100: '#E5F3FF',
	select500: '#0085FF',
	error500: '#FF5AA9',
}

// Init
if (window) {
	const rootStyle = window.document.documentElement.style
	Object.entries(lightTheme).forEach(([name, val]) => {
		rootStyle.setProperty(`--${name}`, val)
	})
}

export const breakpoints = {
	tiny: 320,
	small: 375,
	medium: 425,
	double: 758, // small x 2 + gap 8
} as const

export type TGraduationName = keyof typeof graduations
export const graduations = {
	// From Zero
	z_tiny: [0, breakpoints.tiny],
	z_small: [0, breakpoints.small],
	z_medium: [0, breakpoints.medium],
	z_double: [0, breakpoints.double],

	// To Infinity
	tiny_i: [breakpoints.tiny + 1, Infinity],
	small_i: [breakpoints.small + 1, Infinity],
	medium_i: [breakpoints.medium + 1, Infinity],
	double_i: [breakpoints.double + 1, Infinity],
} as const

const fontWeights = {
	normal: 300,
	bold: 500,
}

const fontDefaults: NestedCSSProperties = {
	fontFamily: 'Roboto, "Helvetica Neue", HelveticaNeue, Helvetica, Arial, sans-serif',
	fontStyle: 'normal',
	fontWeight: fontWeights.normal,
}

export const heroFont: NestedCSSProperties = {
	...fontDefaults,
	fontSize: px(44),
	lineHeight: em(47 / 44),
	letterSpacing: em(-0.025),
}

export const headerFont: NestedCSSProperties = {
	...fontDefaults,
	fontSize: px(24),
	lineHeight: em(28 / 24),
	letterSpacing: em(-0.01),
}

export const mediumFont: NestedCSSProperties = {
	...fontDefaults,
	fontSize: px(17),
	lineHeight: em(20 / 17),
}

export const mediumFontBold: NestedCSSProperties = {
	...mediumFont,
	fontWeight: fontWeights.bold,
}

export const smallFont: NestedCSSProperties = {
	...fontDefaults,
	fontSize: px(14),
	lineHeight: em(16 / 14),
}

export const smallFontBold: NestedCSSProperties = {
	...smallFont,
	fontWeight: fontWeights.bold,
}

export const unitFont: NestedCSSProperties = {
	fontFamily: '"Roboto Mono", monospace',
	fontStyle: 'normal',
	fontWeight: 400,
	fontSize: px(12),
	lineHeight: px(14),
}

type ILinkFontProps = Record<'colorLink', string>
export const linkFont: (props?: Partial<ILinkFontProps>) => NestedCSSProperties = (props) => {
	const variables: ILinkFontProps = { colorLink: tv('select500'), ...props }
	return {
		...applyVariables(variables),
		textDecoration: 'none',
		color: 'var(--color-link)',
		$nest: {
			'&:hover': {
				textDecoration: 'underline',
			},
		},
	}
}

export const shadowCanvas: NestedCSSProperties = {
	boxShadow: ['0 0 5px rgba(0, 0, 0, 0.1)', '0 0 2px rgba(0, 0, 0, 0.1)'].join(', '),
}

export const shadowModal: NestedCSSProperties = {
	boxShadow: [
		'0 20px 70px rgba(0, 0, 0, 0.3)',
		'0 10px 30px rgba(0, 0, 0, 0.2)',
		'0 0 6px rgba(0, 0, 0, 0.4)',
	].join(', '),
}

export const tv = (key: keyof typeof lightTheme) => `var(--${key})`

export const applyVariables = (variables: { [key: string]: string }): any => {
	return Object.entries(variables).reduce<any>((acc, [name, val]) => {
		acc[`--${name}`] = val
		return acc
	}, {})
}

export const scroll: NestedCSSProperties = {
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
