import { currentComponent } from '../diff/currentComponent'

export const useEffect = (callback: UseEffectCallback, depArray?: any[]): void => {
	const { hooks, currentHookIndex, addDestroymentCallback } = currentComponent.get()

	const hasNoDeps = !depArray
	const deps = hooks[currentHookIndex]
	const hasChangedDeps = deps ? !depArray?.every((el, i) => Object.is(el, deps[i])) : true

	if (hasNoDeps || hasChangedDeps) {
		const useEffectDestroymentCallback = callback()
		if (useEffectDestroymentCallback) addDestroymentCallback(useEffectDestroymentCallback)

		hooks[currentHookIndex] = depArray
	}

	currentComponent.incrementHookIndex()
}

export type UseEffectCallback = () => UseEffectCallbackDestroyment | void

export type UseEffectCallbackDestroyment = () => void
