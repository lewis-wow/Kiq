import { diffChildren } from './diffChildren'
import { diffProps } from './diffProps'
import { render } from '../DOM/render'
import { VirtualTextNode, VirtualElementNode, VirtualComponentNode, VirtualNode, Patch } from '../types'
import { mount } from '../DOM/mount'
import { getDOM } from '../DOM/getDOM'
import { isFunctionalComponent } from '../utils/isFunctionalComponent'
import { VirtualElement } from '../vnode/createElement'

export const diff = (oldNode: VirtualTextNode | VirtualElementNode | VirtualComponentNode, newNode: VirtualNode): Patch => {
	if (newNode === null) {
		return () => {
			if (oldNode.$$type === 'component') {
				oldNode.node.destroy()
				return null
			}

			oldNode?.dom?.remove()
			return null
		}
	}

	if (typeof newNode === 'string' || typeof newNode === 'number') {
		if (oldNode.$$type === 'text') {
			return () => {
				if (oldNode.node !== newNode) oldNode.dom.nodeValue = newNode.toString()

				return {
					dom: oldNode.dom,
					node: newNode,
					$$type: 'text',
				}
			}
		}

		return () => {
			const rendered = render(newNode)
			mount(rendered, (node) => getDOM(oldNode)?.replaceWith(node))

			if (oldNode.$$type === 'component') {
				oldNode.node.destroy()
			}

			return rendered
		}
	}

	if (oldNode.$$type === 'text') {
		return () => {
			const rendered = render(newNode)
			mount(rendered, (node) => oldNode.dom.replaceWith(node))

			return rendered
		}
	}

	if (oldNode.$$type === 'component' || isFunctionalComponent(newNode.type)) {
		return () => null
	}

	if (oldNode.node.type !== newNode.type) {
		return () => {
			const rendered = render(newNode)
			mount(rendered, (node) => oldNode.dom.replaceWith(node))

			return rendered
		}
	}

	const propsPatch = diffProps(oldNode.node.props, newNode.props)
	const childrenPatch = diffChildren(oldNode.node.props.children, newNode.props.children)

	return () => {
		const newProps = propsPatch(oldNode.dom)
		const newChildren = childrenPatch(oldNode.dom)

		return {
			$$type: 'element',
			node: {
				props: { ...newProps, children: newChildren.filter((child): child is VirtualTextNode | VirtualComponentNode | VirtualElementNode => child !== null) },
				type: (newNode as VirtualElement<keyof HTMLElementTagNameMap>).type,
			},
			dom: oldNode.dom,
			key: (newNode as VirtualElement<keyof HTMLElementTagNameMap>).key,
			ref: (newNode as VirtualElement<keyof HTMLElementTagNameMap>).ref,
		}
	}
}
