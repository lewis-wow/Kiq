import { mount } from '../DOM/mount'
import { diff } from './diff'
import { diffReorderChildren } from './diffReorderChildren'
import { render } from '../DOM/render'
import { VirtualNodeChildren, VirtualNode, VirtualElementNode, VirtualTextNode, VirtualComponentNode } from '../types'
import { isNullish, isObject } from '../utils'

function keyToIndex(children: VirtualNode[]): { keyed: Record<string, number>; free: number[] }
function keyToIndex(children: VirtualNodeChildren): { keyed: Record<string, number>; free: number[] }
function keyToIndex(children: VirtualNodeChildren | VirtualNode[]) {
	const keyed: Record<string, number> = {}
	const free: number[] = []

	children.forEach((child, index) => {
		if (!isObject(child)) {
			free.push(index)
			return
		}

		if ('key' in child && !isNullish(child.key)) {
			keyed[child.key] = index
		} else {
			free.push(index)
		}
	})

	return { keyed, free }
}

export type ChildrenPatch = (node: HTMLElement) => VirtualNodeChildren

export const diffChildren = (oldChildren: VirtualNodeChildren, newChildren: VirtualNode[]): ChildrenPatch => {
	const childPatches: (() => void)[] = []
	const additionalPatches: ((node: HTMLElement) => void)[] = []
	const updatedChildren: VirtualNodeChildren = [...oldChildren]

	const { keyed: keyedOld, free: freeOld } = keyToIndex(oldChildren)
	const { keyed: keyedNew, free: freeNew } = keyToIndex(newChildren)

	const reorderedPatches = diffReorderChildren(keyedOld, keyedNew, oldChildren)

	for (const newIndex of freeNew) {
		if (!freeOld.includes(newIndex)) {
			const rendered = render(newChildren[newIndex])
			updatedChildren.push(rendered)

			additionalPatches.push((parent) => mount(rendered, parent))
			continue
		}

		const patch = diff(oldChildren[newIndex] as VirtualElementNode | VirtualTextNode | VirtualComponentNode, newChildren[newIndex])

		childPatches.push(() => {
			const node = oldChildren[newIndex]?.dom
			updatedChildren[newIndex] = null
			if (!node) return

			updatedChildren[newIndex] = patch(node)
		})

		freeOld.splice(freeOld.indexOf(newIndex), 1)
	}

	for (const oldIndex of freeOld) {
		const patch = diff(oldChildren[oldIndex] as VirtualElementNode | VirtualTextNode | VirtualComponentNode, null)

		childPatches.push(() => (updatedChildren[oldIndex] = oldChildren[oldIndex]?.dom ? patch(oldChildren[oldIndex]?.dom as HTMLElement | Text) : null))
	}

	for (const [newChildrenKey, newChildrenIndex] of Object.entries(keyedNew)) {
		if (!(newChildrenKey in keyedOld) || oldChildren[keyedOld[newChildrenKey]] === null) {
			const rendered = render(newChildren[newChildrenIndex])
			updatedChildren.splice(newChildrenIndex, 0, rendered)

			additionalPatches.push((parent) => mount(rendered, (child) => parent.insertBefore(child, parent.childNodes[newChildrenIndex])))
			continue
		}

		const oldIndex = keyedOld[newChildrenKey]
		const patch = diff(oldChildren[oldIndex] as VirtualElementNode | VirtualTextNode | VirtualComponentNode, newChildren[newChildrenIndex])

		childPatches.push(() => {
			updatedChildren[newChildrenIndex] = patch((oldChildren[oldIndex] as VirtualTextNode | VirtualElementNode | VirtualComponentNode).dom as HTMLElement | Text)
		})

		delete keyedOld[newChildrenKey]
	}

	for (const oldChildrenIndex of Object.values(keyedOld)) {
		const oldVirtualNode = oldChildren[oldChildrenIndex]
		const patch = diff(oldVirtualNode as VirtualElementNode | VirtualTextNode | VirtualComponentNode, null)

		childPatches.push(() => {
			patch(oldVirtualNode?.dom as HTMLElement | Text)
			updatedChildren[oldChildrenIndex] = null
		})
	}

	return (parent) => {
		for (const childPatch of childPatches) childPatch()

		for (const additionalPatch of additionalPatches) additionalPatch(parent)

		for (const reorderedPatch of reorderedPatches) reorderedPatch(parent)

		return updatedChildren.filter((child) => child !== null)
	}
}
