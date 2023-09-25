import { render } from '../DOM/render'
import { VirtualComponentNode, VirtualElementNode, VirtualNode, VirtualTextNode } from '../types'

export class Component<TProps extends object = any> {
	rendered: VirtualTextNode | VirtualElementNode | VirtualComponentNode | null = null
	hooks: any[] = []
	destroymentCallbacks: (() => void)[] = []
	currentHookIndex = 0

	constructor(public functionalComponent: FunctionalComponent<TProps>) {}

	render(props: TProps) {
		const functionalComponentVirualNode = this.functionalComponent(props)
		this.currentHookIndex = 0 // reset for next rerender
		this.rendered = render(functionalComponentVirualNode)

		return this
	}

	addDestroymentCallback(destroymentCallback: () => void) {
		this.destroymentCallbacks.push(destroymentCallback)
	}

	destroy() {
		for (const destroymentCallback of this.destroymentCallbacks) {
			destroymentCallback()
		}
	}
}

export type FunctionalComponent<TProps extends Record<string, any> = Record<string, any>> = (props: TProps) => VirtualNode
