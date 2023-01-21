import Component, { ComponentWrapper } from './vnode/component'

export const isObject = (val: unknown): val is Record<any, any> => val !== null && typeof val === 'object'

export const isNullish = (val: unknown): val is null | undefined => val === null || val === undefined

export const isFunction = (val: unknown): val is Function => typeof val === 'function'

export const isArray = (val: unknown): val is Array<any> => Array.isArray(val)

export const isComponent = (val: unknown): val is Component => isFunction(val) && (val instanceof ComponentWrapper || val.constructor === Component.prototype.constructor)
