import { VirtualFragmentNode } from '../types'
import { isNullish } from '../utils'

const getChildIndex = (node: Node, parent: Node) => Array.prototype.indexOf.call(parent.childNodes, node)

function reorderChildren(node: Node, direction: number): (parent: HTMLElement | Text) => void {
	if (direction < 0) {
		return (parent) => {
			let i = 0
			while (i > direction && node.previousSibling) {
				parent.insertBefore(node, node.previousSibling)
				i--
			}
		}
	}

	return (parent) => {
		let i = 0
		while (i < direction && node.nextSibling) {
			parent.insertBefore(node, node.nextSibling.nextSibling)
			i++
		}
	}
}

export const diffReorderChildren = (
	oldKeys: Record<string, number>,
	newKeys: Record<string, number>,
	oldChildren: VirtualFragmentNode,
): ((parent: HTMLElement | Text) => void)[] => {
	const reorderedPatches: ((parent: HTMLElement | Text) => void)[] = []

	for (const [oldKey, oldIndex] of Object.entries(oldKeys)) {
		if (oldKey in newKeys) {
			const newIndex = newKeys[oldKey]

			reorderedPatches.push((parent) => {
				const node = oldChildren[oldIndex]?.dom
				if (isNullish(node)) return

				const currIndex = getChildIndex(node, parent)
				if (currIndex === newIndex) return

				const direction = newIndex - currIndex
				reorderChildren(node, direction)(parent)
			})
		}
	}

	return reorderedPatches
}
