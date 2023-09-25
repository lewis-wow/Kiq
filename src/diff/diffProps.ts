import { getEventName } from '../DOM/getEventName'
import { isEvent } from '../DOM/isEvent'
import { isProperty } from '../DOM/isProperty'
import { VirtualElementNode } from '../types'
import { isObject } from '../utils'
import { VirtualElement } from '../vnode/createElement'
import { Patch } from './diff'
import { propertyAttributeMap } from './propertyAttributeMap'

export const diffProps = (oldNode: VirtualElementNode, newNode: VirtualElement<keyof HTMLElementTagNameMap>): Patch<VirtualElementNode> => {
	const oldProps = oldNode.node.props
	const newProps = newNode.props

	const propsPatches: ((node: HTMLElement | Text) => void)[] = []
	const updatedProps: Record<string, any> = oldProps

	Object.keys(newProps)
		.filter(isProperty)
		.forEach((key) => {
			if (isEvent(key)) {
				if (!(key in oldProps) || oldProps[key].toString() !== newProps[key].toString()) {
					propsPatches.push((node) => node.addEventListener(getEventName(key), newProps[key]))
					updatedProps[key] = newProps[key]
				}
				return
			}

			if (isObject(newProps[key])) {
				// @ts-ignore
				propsPatches.push((node) => Object.assign(node[key], newProps[key]))
				updatedProps[key] = newProps[key]
				return
			}

			if (newProps[key] !== oldProps[key] || !(key in oldProps)) {
				propsPatches.push((node) => {
					if (node instanceof HTMLElement) {
						if (key in node) {
							// @ts-ignore
							node[key] = newProps[key]
							return
						}

						node.setAttribute(key, newProps[key])
					}
				})

				updatedProps[key] = newProps[key]
			}
		})

	Object.keys(oldProps)
		.filter(isProperty)
		.forEach((key) => {
			if (isEvent(key)) {
				if (!(key in newProps) || oldProps[key].toString() !== newProps[key].toString()) {
					propsPatches.push((node) => node.removeEventListener(getEventName(key), oldProps[key]))
					return
				}
			}

			if (!(key in newProps)) {
				propsPatches.push((node) => {
					if (node instanceof HTMLElement) {
						if (node.hasAttribute(key)) node.removeAttribute(key)

						//@ts-ignore
						if (key in node) node[key] = null

						if (key in propertyAttributeMap) node.removeAttribute(propertyAttributeMap[key])
					}
				})
			}
		})

	return () => {
		for (const patch of propsPatches) patch(oldNode.dom)

		return {
			...oldNode,
			props: {
				...updatedProps,
				children: oldNode.node.props.children,
			},
		}
	}
}
