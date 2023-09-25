import { Component, ComponentWrapper, FunctionalComponent } from './vnode/component'
import { VirtualElement } from './vnode/createElement'

export type Patch = (node: HTMLElement | Text) => VirtualTextNode | VirtualElementNode | VirtualComponentNode | null
export type VirtualNode = string | number | VirtualElement | null

export type VirtualChildren = (string | number | VirtualElement | null)[]

export type VirtualNodeChildren = (VirtualTextNode | VirtualElementNode | VirtualComponentNode | null)[]

export type InputProps<TType extends keyof HTMLElementTagNameMap | FunctionalComponent, TProps extends Record<string, any> = Record<string, any>> = {
	key?: string | number
	ref?: TType extends keyof HTMLElementTagNameMap ? (node: HTMLElementTagNameMap[TType]) => void : undefined
} & Omit<TProps, 'key' | 'ref'>

export type Props<TProps extends Record<string, any> = Record<string, any>> = TProps & {
	children: VirtualChildren
}

export type VirtualTextNode = {
	$$type: 'text'
	node: string | number
	dom: Text
}

export type VirtualElementNode = {
	$$type: 'element'
	node: {
		type: string
		props: Record<string, any> & {
			children: (VirtualTextNode | VirtualElementNode | VirtualComponentNode)[]
		}
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
