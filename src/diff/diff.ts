import { diffChildren } from './diffChildren'
import { diffProps } from './diffProps'
import { render } from '../DOM/render'
import { VirtualTextNode, VirtualElementNode, VirtualComponentNode, VirtualNode, InputProps } from '../types'
import { mount } from '../DOM/mount'
import { getDOM } from '../DOM/getDOM'
import { isFunctionalComponent } from '../utils/isFunctionalComponent'
import { VirtualElement } from '../vnode/createElement'
import { unmount } from '../DOM/unmount'
import { Component, FunctionalComponent } from '../vnode/component'

export type Patch<TPatchedNode extends VirtualTextNode | VirtualElementNode | VirtualComponentNode | null = VirtualTextNode | VirtualElementNode | VirtualComponentNode | null> = ({
	parentNode,
}: {
	parentNode?: ParentNode | null
}) => TPatchedNode

export const diff = (oldNode: VirtualTextNode | VirtualElementNode | VirtualComponentNode | null, newNode: VirtualNode): Patch => {
	if (oldNode === null) {
		return ({ parentNode }) => {
			if (!parentNode) throw Error('Empty node must have parentNode')

			const rendered = render(newNode)
			mount(rendered, parentNode)

			return rendered
		}
	}

	if (newNode === null) {
		return () => {
			unmount(oldNode)
			getDOM(oldNode)?.remove()

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

			if (oldNode.$$type === 'component') oldNode.node.destroy()

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

	if (oldNode.$$type === 'component' && isFunctionalComponent(newNode.type)) {
		return () => {
			if (oldNode.node.functionalComponent === newNode.type) {
				const virtualNode = oldNode.node.render(newNode.props as InputProps<FunctionalComponent>)
				const patch = diff(oldNode, virtualNode)

				const patchedChildrenNode = patch({ parentNode: getDOM(oldNode)?.parentNode })
				oldNode.node.rendered = patchedChildrenNode

				return {
					$$type: 'component',
					node: oldNode.node,
					key: newNode.key,
				}
			}

			unmount(oldNode)
			const newComponent = new Component(newNode.type as FunctionalComponent)
			newComponent.render(newNode.props as InputProps<FunctionalComponent>)
			const newComponentRenderedDOM = getDOM(newComponent.rendered)

			if (newComponentRenderedDOM) getDOM(oldNode)?.replaceWith(newComponentRenderedDOM)
			else getDOM(oldNode)?.remove()

			return {
				$$type: 'component',
				node: newComponent,
				key: newNode.key,
			}
		}
	}

	if (isFunctionalComponent(newNode.type)) {
		return () => {
			unmount(oldNode)
			const newComponent = new Component(newNode.type as FunctionalComponent)
			const virtualNode = newComponent.render(newNode.props as InputProps<FunctionalComponent>)

			const patch = diff(oldNode, virtualNode)
			const patchedChildren = patch({ parentNode: getDOM(oldNode)?.parentNode })
			newComponent.rendered = patchedChildren

			return {
				$$type: 'component',
				node: newComponent,
				key: newNode.key,
			}
		}
	}

	if (oldNode.$$type === 'component') {
		return () => {
			unmount(oldNode)

			const patch = diff(oldNode.node.rendered, newNode)
			const patchedNode = patch({ parentNode: getDOM(oldNode)?.parentNode })

			return patchedNode
		}
	}

	if (oldNode.node.type !== newNode.type) {
		return () => {
			const rendered = render(newNode)
			mount(rendered, (node) => oldNode.dom.replaceWith(node))

			return rendered
		}
	}

	const propsPatch = diffProps(oldNode, newNode as VirtualElement<keyof HTMLElementTagNameMap>)
	const childrenPatch = diffChildren(oldNode.node.props.children, newNode.props.children)

	return () => {
		const {
			node: { props: newProps },
		} = propsPatch({ parentNode: getDOM(oldNode)?.parentNode })

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
