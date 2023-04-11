import { VirtualComponentNode, VirtualElementNode } from '../types'
import { VirtualElement } from '../vnode/createElement'
import Component, { ComponentWrapper } from '../vnode/component'
import { isFunction } from '../utils'
import { diff } from './diff'

export type ComponentPatch = () => VirtualComponentNode

export function diffComponents(oldComponent: VirtualComponentNode, newComponent: VirtualElement<string>): ComponentPatch
export function diffComponents(oldComponent: VirtualComponentNode, newComponent: VirtualElement<typeof Component>): ComponentPatch
export function diffComponents(oldComponent: VirtualElementNode, newComponent: VirtualElement<typeof Component>): ComponentPatch
export function diffComponents(oldComponent: VirtualComponentNode | VirtualElementNode, newComponent: VirtualElement) {
	if (oldComponent.$$type === 'component') {
		if (isFunction(newComponent.type)) {
			if (oldComponent.node.component.type === newComponent.type) {
				return oldComponent.node.update(newComponent as VirtualElement<typeof Component>)
			}

			return oldComponent.node.replaceWith(newComponent as VirtualElement<typeof Component>)
		}

		return oldComponent.node.replaceWith(newComponent as VirtualElement<string>)
	}

	const componentWrapper = new ComponentWrapper(new (newComponent.type as typeof Component)(newComponent.props))
	const virtualNode = componentWrapper.component.Element(componentWrapper.component.props, componentWrapper.component.state)
	const patch = diff(oldComponent, virtualNode)
	componentWrapper.component.onComponentRender(oldComponent.dom)

	return () => {
		componentWrapper.component.onComponentWillMount()
		componentWrapper.virtualNode = patch(oldComponent.dom as Text | HTMLElement)
		componentWrapper.component.onComponentMount()
		componentWrapper.rendered = true

		return {
			dom: oldComponent.dom,
			node: componentWrapper,
			$$type: 'component',
			key: newComponent.key,
		}
	}
}
