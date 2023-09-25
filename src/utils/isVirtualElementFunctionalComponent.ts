import { FunctionalComponent } from '../vnode/component'
import { VirtualElement } from '../vnode/createElement'
import { isFunctionalComponent } from './isFunctionalComponent'

export const isVirtualElementFunctionalComponent = (node: VirtualElement): node is VirtualElement<FunctionalComponent> => isFunctionalComponent(node.type)
