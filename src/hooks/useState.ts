import { currentComponent } from '../diff/currentComponent'

export type UseStatePayload<T> = [T, UseStateSetter<T>]

export const useState = <T>(initialValue: T): UseStatePayload<T> => {
	const { hooks, currentHookIndex } = currentComponent.get()

	const setStateHookIndex = currentHookIndex
	const value = hooks[setStateHookIndex] ?? initialValue

	currentComponent.incrementHookIndex()

	return [value, (value: T) => (hooks[setStateHookIndex] = value)]
}

export type UseStateSetter<T> = (value: T) => void
