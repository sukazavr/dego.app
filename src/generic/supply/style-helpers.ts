import { important, px, rem } from 'csx'
import { media, types } from 'typestyle'

import { graduations, TGraduationName, TThemeVariable } from '../tokens'

export const tv = (key: TThemeVariable) => `var(--${key})`

export const applyVariables = (variables: { [key: string]: string }): any => {
	return Object.entries(variables).reduce<any>((acc, [name, val]) => {
		acc[`--${name}`] = val
		return acc
	}, {})
}

export const mediaGrad = (gradName: TGraduationName, style: types.NestedCSSProperties) => {
	const o: types.MediaQuery = {}
	const [minWidth, maxWidth] = graduations[gradName]
	if (minWidth) {
		o.minWidth = px(minWidth)
	}
	if (maxWidth && maxWidth !== Infinity) {
		o.maxWidth = px(maxWidth)
	}
	return media(o, style)
}

export const graduationToMediaCondition = (gradName: TGraduationName) => {
	const [minWidth, maxWidth] = graduations[gradName]
	return [
		minWidth && `(min-width: ${minWidth}px)`,
		maxWidth && maxWidth !== Infinity && `(max-width: ${maxWidth}px)`,
	]
		.filter(Boolean)
		.join(' and ')
}

type TBoxUnit = number | string
const boxUnitToString = (value: TBoxUnit): string => {
	if (typeof value === 'number') {
		return rem(value) as string
	}
	return value
}

export const gridSpaced = (margin: TBoxUnit) => {
	const spacing = boxUnitToString(margin)
	return {
		marginTop: `-${spacing}`,
		marginLeft: `-${spacing}`,
		'&>*': {
			marginTop: spacing,
			marginLeft: spacing,
		},
	} as types.CSSProperties
}

export const verticalSpaced = (margin: TBoxUnit) => {
	const spacing = boxUnitToString(margin)
	return {
		'&>*': {
			marginBottom: important(spacing),
		},
		'&>*:last-child': {
			marginBottom: important(px(0)),
		},
	} as types.CSSProperties
}

export const horizontalSpaced = (margin: TBoxUnit) => {
	const spacing = boxUnitToString(margin)
	return {
		'&>*': {
			marginRight: important(spacing),
		},
		'&>*:last-child': {
			marginRight: important(px(0)),
		},
	} as types.CSSProperties
}
