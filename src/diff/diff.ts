import { diffChildren } from './diffChildren'
import { diffProps } from './diffProps'
import { render } from '../DOM/render'
import { isFunction } from '../utils'
import { VirtualTextNode, VirtualElementNode, VirtualComponentNode, VirtualNode, Patch } from '../types'
import { mount } from '../DOM/mount'
import { diffComponents } from './diffComponents'

export const diff = (oldNode: VirtualTextNode | VirtualElementNode | VirtualComponentNode, newNode: VirtualNode): Patch => {
	if (newNode === null) {
		return () => {
			if (oldNode.$$type === 'component') {
				oldNode.node.destroy()
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
			mount(rendered, (node) => oldNode.dom?.replaceWith(node))

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

	if (oldNode.$$type === 'component' || isFunction(newNode.type)) {
		// @ts-ignore
		return diffComponents(oldNode, newNode)
	}

	const propsPatch = diffProps((oldNode as VirtualElementNode).node.props, newNode.props)
	const childrenPatch = diffChildren((oldNode as VirtualElementNode).node.children, newNode.children)

	return () => {
		const newProps = propsPatch(oldNode.dom as HTMLElement)
		const newChildren = childrenPatch(oldNode.dom as HTMLElement)

		return {
			dom: oldNode.dom as HTMLElement,
			node: {
				children: newChildren.filter((child): child is VirtualTextNode | VirtualComponentNode | VirtualElementNode => child !== null),
				props: newProps,
				type: newNode.type as string,
			},
			$$type: 'element',
			key: newNode.key,
			ref: newNode.ref,
		}
	}
}
