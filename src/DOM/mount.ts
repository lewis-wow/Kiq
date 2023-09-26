import { VirtualTextNode, VirtualComponentNode, VirtualElementNode } from '../types'
import { isFunction, isNullish } from '../utils'

export const mount = (
	virtualNode: VirtualTextNode | VirtualComponentNode | VirtualElementNode | null,
	op: HTMLElement | Text | ParentNode | ((node: HTMLElement | Text) => void),
): HTMLElement | Text | null => {
	if (isNullish(virtualNode)) return null

	if (virtualNode.$$type === 'element' || virtualNode.$$type === 'text') {
		if (isFunction(op)) {
			op(virtualNode.dom)
			return virtualNode.dom
		}

		op.appendChild(virtualNode.dom)
		return virtualNode.dom
	}

	return mount(virtualNode.node.rendered, op)
}
