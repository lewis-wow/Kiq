import Component, { ComponentWrapper } from '../vnode/component'
import { isNullish, isObject, isFunction } from '../utils'
import { VirtualTextNode, VirtualElementNode, VirtualComponentNode } from '../types'
import { mount } from './mount'
import { VirtualElement } from '../vnode/createElement'

function render(node: null): null
function render(node: string | number): VirtualTextNode
function render(node: VirtualElement<string>): VirtualElementNode
function render(node: VirtualElement<typeof Component>): VirtualComponentNode
function render(node: string | number | VirtualElement | null): VirtualTextNode | VirtualElementNode | VirtualComponentNode | null
function render(node: unknown): VirtualComponentNode | VirtualElementNode | VirtualTextNode | null {
	if (isNullish(node)) return null

	if (typeof node === 'string' || typeof node === 'number') {
		return {
			dom: document.createTextNode(node.toString()),
			node,
			$$type: 'text',
		}
	}

	if (isFunction((node as VirtualElement).type)) {
		// @ts-ignore
		const component = new ComponentWrapper(new (node.type as Component)({ ...node.props, children: node.children }))
		const rendered = component.render()

		return {
			...rendered,
			key: (node as VirtualElement).key,
		}
	}

	const element = document.createElement((node as VirtualElement).type as string)

	Object.keys((node as VirtualElement).props).forEach((key) => {
		if (key.startsWith('on')) {
			return element.addEventListener(key.replace('on', ''), (node as VirtualElement).props[key])
		}

		if (isObject((node as VirtualElement).props[key])) {
			// @ts-ignore
			return Object.assign(element[key], node.props[key])
		}

		// @ts-ignore
		element[key] = props[key]
	})

	const renderedChildren: (VirtualComponentNode | VirtualElementNode | VirtualTextNode)[] = []

	;(node as VirtualElement).children.forEach((child) => {
		const renderResult = render(child)

		if (renderResult) {
			renderedChildren.push(renderResult)
			mount(renderResult, element)
		}
	})

	const key = (node as VirtualElement)?.key ?? null
	const ref = (node as VirtualElement)?.ref ?? null

	ref?.(element)

	return {
		dom: element,
		node: {
			type: (node as VirtualElement<string>).type,
			props: (node as VirtualElement<string>).props,
			children: renderedChildren,
		},
		key,
		ref,
		$$type: 'element',
	}
}

export default render
