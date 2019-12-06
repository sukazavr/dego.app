import React from 'react'
import { fromEvent } from 'rxjs'
import { map, share } from 'rxjs/operators'

import { Atom } from '@grammarly/focal'

import { Input } from '../../generic/components/Input'
import { Stack } from '../../generic/components/Stack'
import { IUnit } from '../../generic/states/unit'
import { useObservable } from '../../generic/supply/react-helpers'
import { MenuContainer } from '../context-menu/ContextMenu'
import { useContextMenu } from '../context-menu/hook'
import { MenuItem } from '../context-menu/MenuItem'
import { MenuButton } from './MenuButton'
import { TUnitOptionsKeys, unitOptions } from './options'

const wheel$ = fromEvent<WheelEvent>(window, 'wheel', { passive: false }).pipe(share())

type TProps = {
	unit$: Atom<IUnit>
	options: TUnitOptionsKeys[]
	onOp?: (...a: any[]) => void
}

export const Text = React.memo<TProps>(({ options, unit$, onOp }) => {
	const unit = useObservable(unit$)
	const unitOptionsScope = options.map((option) => unitOptions[option])
	const potentialOption = unitOptionsScope.find((option) => option.is(unit)) || unitOptions.default
	const ref = React.useRef<HTMLInputElement>(null)
	const [isInvalid, setInvalid] = React.useState<boolean>(false)
	const [value, setValue] = React.useState<string>(potentialOption.unitToString(unit))

	const onChange = React.useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const nextValue = e.target.value
			const unit = potentialOption.stringToUnit(nextValue)
			if (unitOptionsScope.some((option) => option.is(unit))) {
				unit$.set(unit)
				setValue(potentialOption.unitToString(unit))
				setInvalid(false)
			} else {
				setValue(e.target.value)
				setInvalid(true)
			}
		},
		[potentialOption, unitOptionsScope, unit$]
	)

	console.log('render', unit, value)

	return (
		<Input
			spellCheck={false}
			placeholder={potentialOption.placeholder}
			ref={ref}
			isInvalid={isInvalid}
			value={value}
			onChange={onChange}
			onContextMenu={onOp}
			/* onFocus={this.focus}
					onBlur={this.blur}
					onMouseEnter={this.mouseEnter}
					onMouseLeave={this.mouseLeave}
					onKeyDown={this.keyDown} */
		/>
	)
})

export const UnitInput = React.memo<TProps>(({ options, unit$ }) => {
	const ctxMenu = useContextMenu<{ options: TUnitOptionsKeys[]; unit$: Atom<IUnit> }>(
		({ position, payload: { options, unit$ } }) => (
			<MenuContainer position={position}>
				{options.map((optionName) => {
					const option = unitOptions[optionName]
					const unit = unit$.get()
					return (
						<MenuItem
							key={optionName}
							children={optionName}
							active={option.is(unit)}
							onClick={() => unit$.set(option.convert(unit))}
						/>
					)
				})}
			</MenuContainer>
		)
	)
	const menu =
		options.length > 1 ? <MenuButton onClick={ctxMenu.open({ options, unit$ })} /> : null
	return (
		<Stack isInline>
			<Text options={options} unit$={unit$} onOp={ctxMenu.open({ options, unit$ })} />
			{menu}
		</Stack>
	)
})

/* class InputE extends React.PureComponent<TProps, { value: IUnit; invalid: boolean }> {
	state = {
		value: defaultUnit,
		invalid: false,
	}
	private focus = ca<React.FocusEvent<HTMLInputElement>>()
	private blur = ca<React.FocusEvent<HTMLInputElement>>()
	private mouseEnter = ca<React.MouseEvent<HTMLInputElement, MouseEvent>>()
	private mouseLeave = ca<React.MouseEvent<HTMLInputElement, MouseEvent>>()
	private keyDown = ca<React.KeyboardEvent<HTMLInputElement>>()
	private subs!: Subscription[]
	private ref = React.createRef<HTMLInputElement>()
	private isValid = (value: IUnit) => this.props.options.some((key) => unitOptions[key].is(value))
	private change = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = stringToUnit(e.target.value)
		const valid = this.isValid(value)
		if (valid) {
			this.props.unit$.set(value)
		}
		this.setState({ value, invalid: !valid })
	}
	componentDidMount() {
		const unit$ = this.props.unit$
		const canIncrement$ = unit$.view(canIncrement)
		const el = this.ref.current as HTMLInputElement
		this.subs = [
			this.keyDown.$.subscribe((e) => {
				if (e.altKey) {
					e.preventDefault() // Prevent focus out
				}
			}),

			// Select all on focus
			this.focus.$.subscribe(() => {
				el.select()
			}),

			// Increment by keyboard arrows and mouse wheel
			canIncrement$
				.pipe(
					switchMap((canIncrement) =>
						canIncrement
							? merge(
									// mouse wheel
									this.focus.$.pipe(
										switchMap(() =>
											concat(of(0), this.mouseEnter.$).pipe(
												switchMap(() =>
													wheel$.pipe(
														tap((e) => {
															// Prevent zoom-in/out
															if (e.ctrlKey) {
																e.preventDefault()
															}
														}),
														takeUntil(this.mouseLeave.$)
													)
												),
												takeUntil(this.blur.$)
											)
										),
										withLatestFrom(unit$),
										map(([e, unit]) => (e.deltaY < 0 ? 1 : -1) * getMultiplier(unit, e))
									),
									// keyboard arrows
									this.keyDown.$.pipe(
										filter(({ keyCode: c }) => c === 38 || c === 40),
										withLatestFrom(unit$),
										map(
											([e, unit]) => (e.keyCode === 38 ? 1 : -1) * getMultiplier(unit, e)
										)
									)
							  )
							: NEVER
					)
				)
				.subscribe((inc) => {
					unit$.modify((unit) => {
						const n = parseFloat((unit.n + inc).toFixed(2))
						return { ...unit, n }
					})
					requestAnimationFrame(() => {
						el.select()
					})
				}),

			// Follow the source
			unit$.subscribe((unit) => {
				this.setState((state) => {
					if (state.value === unit) {
						return state
					} else {
						return { value: unit, invalid: !this.isValid(unit) }
					}
				})
			}),
		]
	}
}
 */
