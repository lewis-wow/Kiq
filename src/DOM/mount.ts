import { VirtualTextNode, VirtualComponentNode, VirtualElementNode } from '../types'
import { isFunction, isNullish } from '../utils'

export function mount(virtualNode: VirtualTextNode | VirtualComponentNode | VirtualElementNode | null, op: HTMLElement | Text): HTMLElement | Text | null
export function mount(virtualNode: VirtualTextNode | VirtualComponentNode | VirtualElementNode | null, op: (node: HTMLElement | Text) => void): HTMLElement | Text | null
export function mount(
	virtualNode: VirtualTextNode | VirtualComponentNode | VirtualElementNode | null,
	op: HTMLElement | Text | ((node: HTMLElement | Text) => void),
): HTMLElement | Text | null {
	if (isNullish(virtualNode)) return null

	if (isFunction(op)) {
		virtualNode?.dom && op(virtualNode.dom)
		return virtualNode.dom
	}

	virtualNode?.dom && op.appendChild(virtualNode.dom)
	return virtualNode.dom
}

const unmountRec = (virtualNode: VirtualTextNode | VirtualElementNode | VirtualComponentNode) => {
	if (virtualNode.$$type === 'text') return

	if (virtualNode.$$type === 'component') {
		virtualNode.node.unmount()
		return
	}

	for (const child of virtualNode.node.children) {
		unmountRec(child)
	}
}

export const unmount = (virtualNode: VirtualTextNode | VirtualElementNode | VirtualComponentNode | null) => {
	if (isNullish(virtualNode)) return

	unmountRec(virtualNode)
}
