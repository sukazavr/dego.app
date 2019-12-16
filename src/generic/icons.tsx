import React from 'react'

export type TIconName = keyof typeof icons

export const icons = {
	canvas: {
		viewBox: '0 0 24 24',
		path: (
			<>
				<path fillRule="evenodd" d="M20 4H4v16h16V4zM3 3v18h18V3H3z" clipRule="evenodd" />,
				<path fillRule="evenodd" d="M17 7H7v10h10V7zM6 6v12h12V6H6z" clipRule="evenodd" />
			</>
		),
	},
	div: {
		viewBox: '0 0 24 24',
		path: React.createElement('path', {
			fillRule: 'evenodd',
			clipRule: 'evenodd',
			d: 'M20 8H3v8h17V8zM2 7v10h19V7H2z',
		}),
	},
	flexRow: {
		viewBox: '0 0 24 24',
		path: React.createElement('path', {
			fillRule: 'evenodd',
			clipRule: 'evenodd',
			d: 'M8 16V8H3v8h5zm-6 1V7h19v10H2zm12-1H9V8h5v8zm1 0h5V8h-5v8z',
		}),
	},
	flexColumn: {
		viewBox: '0 0 24 24',
		path: React.createElement('path', {
			fillRule: 'evenodd',
			clipRule: 'evenodd',
			d: 'M16 9H8v5h8V9zm0-1H8V3h8v5zm1 13H7V2h10v19zm-9-6v5h8v-5H8z',
		}),
	},
	grid: {
		viewBox: '0 0 24 24',
		path: (
			<path
				fillRule="evenodd"
				d="M3 20V3h17v17H3zM4 4h7v7H4V4zm0 8v7h7v-7H4zm8 0v7h7v-7h-7zm7-1V4h-7v7h7z"
				clipRule="evenodd"
			/>
		),
	},
	component: {
		viewBox: '0 0 24 24',
		path: (
			<path
				fillRule="evenodd"
				d="M5 12a7 7 0 1 0 14 0 7 7 0 0 0-14 0zm7-8a8 8 0 1 0 0 16 8 8 0 0 0 0-16z"
				clipRule="evenodd"
			/>
		),
	},
}
