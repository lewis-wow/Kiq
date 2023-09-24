import { Component, FunctionalComponent } from '../vnode/component'
import { isNullish, isObject } from '../utils'
import { VirtualTextNode, VirtualElementNode, VirtualComponentNode, Props } from '../types'
import { mount } from './mount'
import { VirtualElement } from '../vnode/createElement'
import { isFunctionalComponent } from '../utils/isFunctionalComponent'

export function render(node: null): null
export function render(node: string | number): VirtualTextNode
export function render(node: VirtualElement<string>): VirtualElementNode
export function render(node: VirtualElement<FunctionalComponent>): VirtualComponentNode
export function render(node: string | number | VirtualElement | null): VirtualTextNode | VirtualElementNode | VirtualComponentNode | null
export function render(node: string | number | VirtualElement | null): VirtualTextNode | VirtualElementNode | VirtualComponentNode | null {
	if (isNullish(node)) return null

	if (typeof node === 'string' || typeof node === 'number') {
		return {
			dom: document.createTextNode(node.toString()),
			node,
			$$type: 'text',
		}
	}

	if (isFunctionalComponent(node.type)) {
		const component = new Component<Props>(node.type)
		component.render(node.props)

		return {
			$$type: 'component',
			node: component,
			key: node.key,
		}
	}

	const element = document.createElement(node.type)

	Object.keys(node.props).forEach((key) => {
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

	node.children.forEach((child) => {
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
		$$type: 'element',
		dom: element,
		node: {
			type: node.type,
			props: node.props,
			children: renderedChildren,
		},
		key,
		ref,
	}
}
