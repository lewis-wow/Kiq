import { FunctionalComponent } from './component'
import { InputProps, VirtualChildren } from '../types'
import { isFunctionalComponent } from '../utils/isFunctionalComponent'

export type VirtualElement<TType extends keyof HTMLElementTagNameMap | FunctionalComponent = keyof HTMLElementTagNameMap | FunctionalComponent> = {
	type: TType
	props: InputProps<TType> & {
		children: VirtualChildren
	}
	key?: string | number | null
	ref?: TType extends keyof HTMLElementTagNameMap ? ((node: HTMLElement) => void) | null : null
}

export function createElement<TType extends keyof HTMLElementTagNameMap>(type: TType, props?: InputProps<TType> | null, ...children: VirtualChildren): VirtualElement<TType>
export function createElement<TType extends FunctionalComponent, TProps extends Record<string, any>>(
	type: FunctionalComponent<TProps>,
	props?: InputProps<TType, TProps> | null,
	...children: VirtualChildren
): VirtualElement<FunctionalComponent>

export function createElement<TType extends keyof HTMLElementTagNameMap | FunctionalComponent, TProps extends Record<string, any>>(
	type: TType,
	props?: InputProps<TType, TProps> | null,
	...children: VirtualChildren
): VirtualElement<TType> {
	const { key, ref, ..._props } = props ?? {}

	if (isFunctionalComponent(type)) {
		if (props && 'ref' in props) throw new Error('ref is not supported on components')

		return {
			type,
			props: { ..._props, children },
			key,
			ref: undefined,
		}
	}

	return {
		type,
		props: { ..._props, children },
		key,
		ref,
	} as VirtualElement<typeof type>
}
