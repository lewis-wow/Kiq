import { VirtualComponentNode, VirtualElementNode, VirtualTextNode } from '../types'

export const getDOM = (virtualNode: VirtualElementNode | VirtualTextNode | VirtualComponentNode | null): HTMLElement | Text | null => {
	if (virtualNode === null) return null
	if (virtualNode.$$type === 'element' || virtualNode.$$type === 'text') return virtualNode.dom

	return getDOM(virtualNode.node.rendered)
}
