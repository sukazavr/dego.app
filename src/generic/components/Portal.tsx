import React from 'react'
import ReactDOM from 'react-dom'

import { setRef, useEnhancedEffect, useForkRef } from '../supply/react-helpers'

interface IProps {
	/**
	 * The children to render into the `container`.
	 */
	children: React.ReactNode
	/**
	 * A node, component instance, or function that returns either.
	 * The `container` will have the portal children appended to it.
	 * By default, it uses the body of the top-level document object,
	 * so it's simply `document.body` most of the time.
	 */
	container?: React.ReactInstance | (() => React.ReactInstance | null)
	/**
	 * If `true`, the children stay within it's parent DOM hierarchy.
	 */
	isDisabled?: boolean
	/**
	 * Callback fired once the children has been mounted into the `container`.
	 */
	onRendered?: () => void
}

export const Portal = React.forwardRef<unknown, IProps>(
	({ children, container, isDisabled = false, onRendered }, ref) => {
		const [mountNode, setMountNode] = React.useState<Element | null>(null)
		const handleRef = useForkRef((children as any).ref, ref)

		useEnhancedEffect(() => {
			if (!isDisabled) {
				setMountNode(getContainer(container))
			}
		}, [container, isDisabled])

		useEnhancedEffect(() => {
			if (mountNode && !isDisabled) {
				setRef(ref, mountNode)
				return () => {
					setRef(ref, null)
				}
			}

			return undefined
		}, [ref, mountNode, isDisabled])

		useEnhancedEffect(() => {
			if (onRendered && (mountNode || isDisabled)) {
				onRendered()
			}
		}, [onRendered, mountNode, isDisabled])

		if (isDisabled) {
			React.Children.only(children)
			return React.cloneElement(children as React.DetailedReactHTMLElement<any, HTMLElement>, {
				ref: handleRef,
			})
		}

		return mountNode ? ReactDOM.createPortal(children, mountNode) : mountNode
	}
)

const getContainer = (container?: IProps['container']): Element => {
	const el =
		container && ReactDOM.findDOMNode(typeof container === 'function' ? container() : container)
	return typeof el === 'string' || !el ? document.body : (el as Element)
}
