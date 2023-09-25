import { Component, FunctionalComponent } from '../vnode/component'
import { isNullish, isObject } from '../utils'
import { VirtualTextNode, VirtualElementNode, VirtualComponentNode, InputProps } from '../types'
import { mount } from './mount'
import { VirtualElement } from '../vnode/createElement'
import { isFunctionalComponent } from '../utils/isFunctionalComponent'

export function render(node: null): null
export function render(node: string | number): VirtualTextNode
export function render(node: VirtualElement<keyof HTMLElementTagNameMap>): VirtualElementNode
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
		const component = new Component(node.type)
		component.render(node.props as InputProps<FunctionalComponent>)

		return {
			$$type: 'component',
			node: component,
			key: node.key,
		}
	}

	const element = document.createElement(node.type)

	Object.keys(node.props).forEach((key) => {
		if (key.startsWith('on')) {
			return element.addEventListener(key.replace('on', ''), node.props[key])
		}

		if (isObject(node.props[key])) {
			// @ts-ignore
			return Object.assign(element[key], node.props[key])
		}

		if (key in element) {
			// @ts-ignore
			element[key] = node.props[key]
			return
		}

		element.setAttribute(key, node.props[key])
	})

	const renderedChildren: (VirtualComponentNode | VirtualElementNode | VirtualTextNode)[] = []

	node.props.children.forEach((child) => {
		const renderResult = render(child)

		if (renderResult) {
			renderedChildren.push(renderResult)
			mount(renderResult, element)
		}
	})

	const key = node?.key
	const ref = node?.ref

	ref?.(element)

	return {
		$$type: 'element',
		dom: element,
		node: {
			type: node.type,
			props: { ...node.props, children: renderedChildren },
		},
		key,
		ref,
	}
}
