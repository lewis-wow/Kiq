import { getEventName } from '../DOM/getEventName'
import { isEvent } from '../DOM/isEvent'
import { isProperty } from '../DOM/isProperty'
import { isObject } from '../utils'
import { propertyAttributeMap } from './propertyAttributeMap'

export type PropsPatch = (node: HTMLElement | Text) => Record<string, any>

export const diffProps = (oldProps: Record<string, any>, newProps: Record<string, any>): PropsPatch => {
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

	return (node) => {
		for (const patch of propsPatches) patch(node)

		return updatedProps
	}
}
