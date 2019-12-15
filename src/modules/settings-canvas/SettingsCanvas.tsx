import React from 'react'
import { style } from 'typestyle'

import { Atom } from '@grammarly/focal'

import { Button } from '../../generic/components/Button'
import { ButtonGroup } from '../../generic/components/ButtonGroup'
import { Label } from '../../generic/components/Label'
import { Panel } from '../../generic/components/Panel'
import { Stack } from '../../generic/components/Stack'
import { Switcher } from '../../generic/components/Switcher'
import { Tandem } from '../../generic/components/Tandem'
import { TandemGroup } from '../../generic/components/TandemGroup'
import { lensElementCanvas } from '../../generic/states/elements'
import { stateElements$ } from '../../generic/states/state-app'
import { scrollRegular } from '../../generic/theme'
import { UnitInput } from '../unit-input/UnitInput'

export const SettingsCanvas = React.memo(() => {
	const props = React.useMemo(() => {
		const canvas$ = stateElements$.lens(lensElementCanvas)
		return {
			width$: canvas$.lens('width'),
			height$: canvas$.lens('height'),
		}
	}, [])
	return (
		<div className={$container}>
			<div className={$wrapper}>
				<ButtonGroup style={{ padding: '1rem' }}>
					<Button icon="div" isActive />
					<Button icon="flexHorizontal" />
					<Button icon="flexVertical" />
				</ButtonGroup>
				<Panel title="Background" />
				<TandemGroup>
					<Tandem
						left={<Label children="Transparent" />}
						right={<Switcher isActive$={Atom.create(false)} />}
					/>
				</TandemGroup>
				<Panel title="Size" />
				<TandemGroup>
					<Tandem
						left={
							<Stack spacing={1} isInline>
								<Label children="W" />
								<UnitInput options={['px', 'em']} unit$={props.width$} />
							</Stack>
						}
						right={
							<Stack spacing={1} isInline>
								<Label children="H" />
								<UnitInput options={['px', 'em']} unit$={props.height$} />
							</Stack>
						}
					/>
				</TandemGroup>
			</div>
		</div>
	)
})

const $container = style(scrollRegular, {
	overflow: 'auto',
})

const $wrapper = style({
	minWidth: '180px',
})
