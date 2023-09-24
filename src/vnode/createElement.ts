import { FunctionalComponent } from './component'
import { Props, VirtualChildren } from '../types'
import { isFunctionalComponent } from '../utils/isFunctionalComponent'

export type VirtualElement<TType extends string | FunctionalComponent = string | FunctionalComponent> = {
	type: TType
	props: Props
	children: VirtualChildren
	key?: string | number | null
	ref?: ((node: HTMLElement) => void) | null
}

type CreateElement = {
	(type: string, props?: Props | null, ...children: VirtualChildren): VirtualElement<string>
	<TProps extends Record<string, any>>(type: FunctionalComponent, props?: Props<TProps> | null, ...children: VirtualChildren): VirtualElement<FunctionalComponent>
}

export const createElement: CreateElement = <TProps extends Record<string, any>>(
	type: string | FunctionalComponent,
	props?: Props<TProps> | null,
	...children: VirtualChildren
) => {
	const key = props?.key ?? null

	if (isFunctionalComponent(type)) {
		if (props && 'ref' in props) throw new Error('ref is not supported on components')

		return {
			type,
			props,
			children,
			key,
			ref: null,
		}
	}

	const ref = props?.ref ?? null

	return {
		type,
		props,
		children,
		key,
		ref,
	}
}
