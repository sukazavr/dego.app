import React from 'react'
import { icons, TIconName } from '../icons'

interface IProps extends React.SVGAttributes<SVGElement> {
	icon: TIconName
	color?: string
	size?: string
	role?: 'presentation' | 'img'
}

export class Icon extends React.PureComponent<IProps> {
	render() {
		const {
			icon,
			color = DEFAULT_COLOR,
			size = DEFAULT_SIZE,
			role = 'presentation',
			...rest
		} = this.props
		const { viewBox, path } = icons[icon]
		return (
			<svg role={role} width={size} height={size} viewBox={viewBox} fill={color} {...rest}>
				{path}
			</svg>
		)
	}
}

const DEFAULT_COLOR = 'currentColor'
const DEFAULT_SIZE = '1em'
