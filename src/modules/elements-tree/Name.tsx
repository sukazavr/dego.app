import React from 'react'
import { Subscription } from 'rxjs'
import { style } from 'typestyle'

import { Atom } from '@grammarly/focal'

import { actionsTree } from '../../generic/actions'

type TProps = {
	id: string
	name$: Atom<string>
}

export class Name extends React.PureComponent<TProps> {
	state = {
		value: '',
		disabled: true,
	}
	private ref = React.createRef<HTMLInputElement>()
	private subs: Subscription[] = []
	private reset = () => {
		this.setState({ disabled: true, value: this.props.name$.get() })
	}
	private change = (e: React.ChangeEvent<HTMLInputElement>) => {
		this.setState({ value: e.target.value })
	}
	private commit = () => {
		const nextName = this.state.value.trim()
		if (nextName) {
			this.props.name$.set(nextName)
			this.setState({ disabled: true })
		} else {
			this.reset()
		}
	}
	private edit = ({ id }: { id: string }) => {
		if (id === this.props.id) {
			this.setState({ disabled: false })
			requestAnimationFrame(() => {
				const el = this.ref.current as HTMLInputElement
				el.select()
			})
		}
	}
	private keyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.keyCode === 13) {
			e.preventDefault()
			if (e.shiftKey) {
				// TODO: edit next
			}
			this.commit()
		} else if (e.keyCode === 27) {
			this.reset()
		}
	}
	componentDidMount() {
		this.subs = [
			this.props.name$.subscribe((value) => this.setState({ value })),
			actionsTree.editName.$.subscribe(this.edit),
		]
	}
	componentWillUnmount() {
		this.subs.forEach((sub) => sub.unsubscribe())
	}
	render() {
		return (
			<div className={$container} onDoubleClick={actionsTree.editName._({ id: this.props.id })}>
				<input
					type="text"
					ref={this.ref}
					className={$nameInput}
					value={this.state.value}
					disabled={this.state.disabled}
					onKeyDown={this.keyDown}
					onChange={this.change}
					onBlur={this.commit}
				/>
			</div>
		)
	}
}

const $container = style({
	flexGrow: 1,
	display: 'flex',
})

const $nameInput = style({
	flex: '1 1 0',
	width: 0,
	border: 0,
	lineHeight: 1.4,
	borderRadius: '.2em',
	backgroundColor: '#fff',
	color: '#000',
	outline: 'none',
	$nest: {
		'&[disabled]': {
			backgroundColor: 'transparent',
			color: 'inherit',
		},
	},
})
