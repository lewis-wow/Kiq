import { isObject } from '../utils'

export const removeObjectProps = (props: Record<string, any>) => {
	Object.keys(props).forEach((key) => {
		if (isObject(props[key])) return removeObjectProps(props[key])

		props[key] = null
	})
}
