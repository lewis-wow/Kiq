import { mount } from './DOM/mount'
import Component from './vnode/component'
import { render as renderDOM } from './DOM/render'
import { VirtualElement, createElement } from './vnode/createElement'

const render = (vnode: VirtualElement, container: HTMLElement, callback?: (node: HTMLElement) => void) => {
	window.requestAnimationFrame(() => {
		const node = renderDOM(vnode)
		mount(node, container)
		callback?.(node?.dom as HTMLElement)
	})
}

const replace = (vnode: VirtualElement, container: HTMLElement, callback?: (node: HTMLElement) => void) => {
	window.requestAnimationFrame(() => {
		const node = renderDOM(vnode)
		mount(node, (child) => container.replaceWith(child))
		callback?.(node?.dom as HTMLElement)
	})
}

export { Component, render, replace, createElement }
export default { Component, render, replace, createElement }
