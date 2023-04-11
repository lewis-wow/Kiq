import { ComponentWrapper } from './vnode/component'
import { VirtualElement } from './vnode/createElement'

export type Patch = (node: HTMLElement | Text) => VirtualTextNode | VirtualElementNode | VirtualComponentNode | null
export type VirtualNode = string | number | VirtualElement | null

export type VirtualFragmentNode = (VirtualTextNode | VirtualElementNode | VirtualComponentNode | null)[]

export interface VirtualTextNode {
	$$type: 'text'
	node: string | number
	dom: Text
}

export interface VirtualElementNode {
	$$type: 'element'
	node: {
		type: string
		props: Record<string, any>
		children: (VirtualTextNode | VirtualElementNode | VirtualComponentNode)[]
	}
	dom: HTMLElement
	key?: string | number | null
	ref?: ((node: HTMLElement) => void) | null
}

export interface VirtualComponentNode {
	$$type: 'component'
	node: ComponentWrapper
	dom: HTMLElement | Text | null
	key?: string | number | null
	ref?: ((node: HTMLElement) => void) | null
}
