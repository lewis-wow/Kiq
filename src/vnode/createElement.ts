import Component from './component'
import { isNullish } from '../utils'

export interface VirtualElement<T extends string | typeof Component = string | typeof Component> {
	type: T
	props: Record<string, any>
	children: (string | number | VirtualElement | null)[]
	key?: string | number | null
	ref?: ((node: HTMLElement) => void) | null
}

function createElement(type: string, props?: Record<string, any> | null, ...children: (string | number | VirtualElement | null)[]): VirtualElement<string>
function createElement(type: typeof Component, props?: Record<string, any> | null, ...children: (string | number | VirtualElement | null)[]): VirtualElement<typeof Component>
function createElement(type: unknown, props: Record<string, any> | null = null, ...children: (string | number | VirtualElement | null)[]): VirtualElement {
	if (isNullish(props)) props = {}

	const key = props?.key ?? null
	'key' in props && delete props.key

	if (typeof type === 'function') {
		if ('ref' in props) throw TypeError('ref is not supported on components')

		return {
			type: type as typeof Component,
			props,
			children,
			key,
			ref: null,
		}
	}

	const ref = props?.ref ?? null
	'ref' in props && delete props.ref

	return {
		type: type as string,
		props,
		children,
		key,
		ref,
	}
}

export default createElement
