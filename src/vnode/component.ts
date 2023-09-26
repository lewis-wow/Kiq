import { InputProps, VirtualComponentNode, VirtualElementNode, VirtualNode, VirtualTextNode } from '../types'

export class Component {
	rendered: VirtualTextNode | VirtualElementNode | VirtualComponentNode | null = null
	hooks: any[] = []
	destroymentCallbacks: (() => void)[] = []
	currentHookIndex = 0

	constructor(public functionalComponent: FunctionalComponent<InputProps<FunctionalComponent>>) {}

	render(props: InputProps<FunctionalComponent>) {
		return this.functionalComponent(props)
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
