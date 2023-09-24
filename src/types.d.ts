import { Component, ComponentWrapper, FunctionalComponent } from './vnode/component'
import { VirtualElement } from './vnode/createElement'

export type Patch = (node: HTMLElement | Text) => VirtualTextNode | VirtualElementNode | VirtualComponentNode | null
export type VirtualNode = string | number | VirtualElement | null

export type VirtualFragmentNode = (VirtualTextNode | VirtualElementNode | VirtualComponentNode | null)[]

export type VirtualChildren = (string | number | VirtualElement | null)[]

export type Props<TProps extends Record<string, any> = Record<string, any>> = {
	key?: string | number
	ref?: ((node: HTMLElement) => void) | null
} & Omit<TProps, 'key' | 'ref'>

export type VirtualTextNode = {
	$$type: 'text'
	node: string | number
	dom: Text
}

export type VirtualElementNode = {
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

export type VirtualComponentNode = {
	$$type: 'component'
	node: Component
	key?: string | number | null
}
