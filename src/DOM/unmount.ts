import { VirtualComponentNode, VirtualElementNode, VirtualTextNode } from '../types'

export const unmount = (virtualNode: VirtualElementNode | VirtualComponentNode | VirtualTextNode | null) => {
	if (virtualNode === null || virtualNode.$$type === 'text') return

	if (virtualNode.$$type === 'element') {
		for (const child of virtualNode.node.props.children) {
			unmount(child)
		}

		return
	}

	unmount(virtualNode.node.rendered)
	virtualNode.node.destroy()
}
