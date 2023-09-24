import { FunctionalComponent } from '../vnode/component'

export const isFunctionalComponent = (component: unknown): component is FunctionalComponent => typeof component === 'function'
