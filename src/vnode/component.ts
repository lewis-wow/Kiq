import render from '../DOM/render'
import { isFunction, isObject } from '../utils'
import { VirtualTextNode, VirtualElementNode, VirtualComponentNode } from '../types'
import { VirtualElement } from './createElement'
import { diff } from '../diff/diff'
import { unmount, mount } from '../DOM/mount'

export class ComponentWrapper {
	public virtualNode: VirtualTextNode | VirtualElementNode | VirtualComponentNode | null = null
	public rendered = false
	public mounted = false

	private originalSetState

	constructor(public component: Component) {
		this.originalSetState = component.setState
	}

	render(): VirtualComponentNode {
		if (this.rendered) throw new Error('Component cannot be rendered twice')

		const vnode = this.component.Element(this.component.props, this.component.state)
		const rendered = render(vnode)

		this.virtualNode = rendered
		this.rendered = true

		this.component.setState = (state: Record<string, any> | ((state: Record<string, any>) => Record<string, any>)) => {
			const nextState = isFunction(state) ? state(this.component.state) : state

			if (!this.rendered) throw new Error('Component that is not rendered cannot be updated')

			if (!this.component.shouldComponentUpdate(this.component.props, { ...this.component.state, ...nextState })) {
				this.component.state = nextState
				this.component.onComponentCancelUpdate()

				return
			}

			const snapshot = this.component.getSnapshotBeforeUpdate()
			Object.assign(this.component.state, nextState)

			this.component.onComponentWillUpdate(snapshot)

			const nextVNode = this.component.Element(this.component.props, this.component.state)

			const patch = diff(this.virtualNode as VirtualTextNode | VirtualElementNode | VirtualComponentNode, nextVNode)
			this.virtualNode = patch(this.virtualNode?.dom as HTMLElement)
		}

		this.component.onComponentRender(rendered?.dom || null)

		return {
			dom: rendered?.dom || null,
			node: this,
			$$type: 'component',
		}
	}

	replaceWith(newComponent: VirtualElement<string>): () => VirtualElementNode
	replaceWith(newComponent: VirtualElement<typeof Component>): () => VirtualComponentNode
	replaceWith(newComponent: VirtualElement): () => VirtualComponentNode | VirtualElementNode {
		if (!this.rendered) throw new Error('Component that is not rendered cannot be replaced')

		if (isObject(newComponent) && isFunction(newComponent.type)) {
			// @ts-ignore
			const newComponentInstance = new ComponentWrapper(new newComponent(newComponent.props))
			const newComponentVNode = newComponentInstance.component.Element(newComponentInstance.component.props, newComponentInstance.component.state)

			const patch = diff(this.virtualNode as VirtualTextNode | VirtualElementNode | VirtualComponentNode, newComponentVNode)

			return () => {
				newComponentInstance.virtualNode = patch(this.virtualNode?.dom as HTMLElement)

				newComponentInstance.component.onComponentRender(this.virtualNode?.dom as HTMLElement)

				newComponentInstance.component.onComponentWillMount()
				this.unmount()
				newComponentInstance.component.onComponentMount()
				newComponentInstance.rendered = true

				return {
					dom: newComponentInstance.virtualNode?.dom || null,
					node: newComponentInstance,
					$$type: 'component',
					key: newComponent?.key ?? null,
				}
			}
		}

		const patch = diff(this.virtualNode as VirtualTextNode | VirtualElementNode | VirtualComponentNode, newComponent)

		return () => {
			const patched = patch(this.virtualNode?.dom as HTMLElement) as VirtualElementNode
			this.unmount()

			return {
				dom: patched.dom,
				node: patched.node,
				$$type: patched.$$type,
				key: newComponent?.key ?? null,
			}
		}
	}

	mount(container: HTMLElement) {
		if (!this.rendered) this.render()
		this.component.onComponentWillMount()
		mount(this.virtualNode, container)

		this.component.onComponentMount()
		this.mounted = true
	}

	unmount() {
		this.component.onComponentWillUnMount(this.virtualNode?.dom || null)
		unmount(this.virtualNode as VirtualTextNode | VirtualComponentNode | VirtualElementNode)
		this.mounted = this.rendered = false
		this.virtualNode = null
		this.component.setState = this.originalSetState
	}

	update(nextComponent: VirtualElement<typeof Component>): () => VirtualComponentNode {
		if (!this.rendered) throw new Error('Component that is not rendered cannot be updated')

		const nextState = { ...this.component.state, ...this.component.componentWillGetProps(nextComponent.props) }

		if (!this.component.shouldComponentUpdate(nextComponent.props, nextState)) {
			this.component.props = nextComponent.props
			this.component.state = nextState
			this.component.onComponentCancelUpdate()

			return () => ({
				dom: this.virtualNode?.dom || null,
				node: this,
				$$type: 'component',
				key: nextComponent?.key ?? null,
			})
		}

		const snapshot = this.component.getSnapshotBeforeUpdate()
		this.component.props = nextComponent.props
		this.component.state = nextState

		this.component.onComponentWillUpdate(snapshot)

		const nextVNode = this.component.Element(this.component.props, this.component.state)
		const patch = diff(this.virtualNode as VirtualTextNode | VirtualElementNode | VirtualComponentNode, nextVNode)

		return () => {
			this.virtualNode = patch(this.virtualNode?.dom as HTMLElement | Text)
			this.component.onComponentUpdate(snapshot)

			return {
				dom: this.virtualNode?.dom || null,
				node: this,
				$$type: 'component',
				key: nextComponent?.key ?? null,
			}
		}
	}
}

export default class Component {
	public state: Record<string, any> = {}
	public type = this.constructor

	constructor(public props: Record<string, any> = {}) {}

	Element(_props: Record<string, any>, _state: Record<string, any>): string | number | VirtualElement {
		throw Error('You have to specify Element method in your Component, Element must return virtual element')
	}

	setState(_state: Record<string, any> | ((state: Record<string, any>) => Record<string, any>)) {
		throw Error('setState(...) can be called only if component is rendered, will be mounted or is mounted')
	}

	onComponentRender(_dom: Node | null) {}

	onComponentWillUpdate(_snapshot: Record<string, any> | null) {}

	onComponentUpdate(_snapshot: Record<string, any> | null) {}

	onComponentWillMount() {}

	onComponentMount() {}

	onComponentCancelUpdate() {}

	componentWillGetProps(_props: Record<string, any>): Record<string, any> {
		return {}
	}

	onComponentWillUnMount(_dom: Node | null) {}

	getSnapshotBeforeUpdate(): Record<string, any> | null {
		return null
	}

	shouldComponentUpdate(_nextProps: Record<string, any>, _nextState?: Record<string, any>) {
		return true
	}

	static isKiqComponent = true
}
