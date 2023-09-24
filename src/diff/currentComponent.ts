import { Component } from '../vnode/component'

class CurrentComponent {
	public component: Component | null = null
	public destroymentCallbacks: (() => void)[] = []

	set(component: Component) {
		this.component = component

		return this
	}

	get() {
		if (this.component === null) throw new Error('get current component in hook must be called within a component')

		return this.component
	}

	incrementHookIndex() {
		if (this.component === null) throw new Error('incrementHookIndex in hook must be called within a component')

		this.component.currentHookIndex++

		return this
	}
}

export const currentComponent = new CurrentComponent()
