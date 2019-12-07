import React from 'react'
import { DragLayer, DragSource, DropTarget } from 'react-dnd'
import { getEmptyImage } from 'react-dnd-html5-backend'

import { ROOT_ID } from '../../generic/states/elements'
import { dndEndDragging, dndHoverTarget, dndSetCursorPosition, dndStartDragging } from './state'
import { IElementProps, TCursorPosition } from './types'

const TYPE = 'tree'

export const CursorCapture = DragLayer((monitor) => ({
	cursorPosition: monitor.getClientOffset(),
}))(({ cursorPosition }: { cursorPosition: TCursorPosition }) => {
	// Coz react render fn should be pure,
	// but with react-dnd I don't know other solution how to
	// capture cursor during dragging **mousemove doesn't work
	requestAnimationFrame(() => {
		dndSetCursorPosition(cursorPosition)
	})
	return null
})

export const makeDnDRoot = (Component: React.ReactNode) => {
	return DropTarget(
		TYPE,
		{
			hover: (props, monitor) => {
				if (monitor.isOver({ shallow: true })) {
					dndHoverTarget(ROOT_ID)
				}
			},
			canDrop: (props, monitor) => monitor.isOver({ shallow: true }),
		},
		(connect) => ({
			connectDropTarget: connect.dropTarget(),
		})
	)(Component as any)
}

export const makeDnDElement = (Component: React.ReactNode): React.FC<IElementProps> => {
	return DropTarget<IElementProps>(
		TYPE,
		{
			hover: (props) => {
				dndHoverTarget(props.id)
			},
			canDrop: (props, monitor) => {
				return !props.path.includes((monitor.getItem() as IElementProps).id)
			},
		},
		(connect) => ({
			connectDropTarget: connect.dropTarget(),
		})
	)(
		DragSource<IElementProps>(
			TYPE,
			{
				canDrag(props) {
					return props.id !== ROOT_ID
				},
				beginDrag(props) {
					dndStartDragging(props.id)
					return props
				},
				endDrag() {
					dndEndDragging()
				},
			},
			(connect) => {
				const connectDragPreview = connect.dragPreview()
				return {
					connectDragSource: connect.dragSource(),
					connectDragEmptyPreview: () => {
						connectDragPreview(getEmptyImage(), {
							// IE fallback: specify that we'd rather screenshot the node
							// when it already knows it's being dragged so we can hide it with CSS.
							captureDraggingState: true,
						})
					},
				}
			}
		)(Component as any)
	) as any
}
