import { getEventName, isEvent } from '../DOM/helpers'
import { isObject } from '../utils'

export const diffProps = (oldProps: Record<string, any>, newProps: Record<string, any>): ((node: HTMLElement | Text) => Record<string, any>) => {
	const propsPatches: ((node: HTMLElement | Text) => void)[] = []
	const updatedProps: Record<string, any> = oldProps

	Object.keys(newProps).forEach((key) => {
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
			// @ts-ignore
			propsPatches.push((node) => (node[key] = newProps[key]))
			updatedProps[key] = newProps[key]
		}
	})

	Object.keys(oldProps).forEach((key) => {
		if (isEvent(key)) {
			if (!(key in newProps) || oldProps[key].toString() !== newProps[key].toString()) {
				propsPatches.push((node) => node.removeEventListener(getEventName(key), oldProps[key]))
				return
			}
		}

		if (!(key in newProps)) {
			// @ts-ignore
			propsPatches.push((node) => (node[key] = null))
		}
	})

	return (node) => {
		for (const patch of propsPatches) patch(node)

		return updatedProps
	}
}
