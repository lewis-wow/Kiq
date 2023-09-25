import { expect, test } from 'vitest'
import { render } from './render'
import { createElement } from '../vnode/createElement'
import { VirtualChildren, VirtualComponentNode, VirtualElementNode } from '../types'

test('render div virtual node', () => {
	const divVirtualNode = createElement('div', { className: 'a b c d' }, 'Hello world')
	const rendered = render(divVirtualNode)

	expect(rendered.dom).toMatchInlineSnapshot(`
		<div
		  class="a b c d"
		>
		  Hello world
		</div>
	`)
})

test('render Button component', () => {
	const Button = ({ children }: { children: VirtualChildren }) => {
		return createElement('button', { className: 'a b c d' }, ...children)
	}

	const virtualNode = createElement(Button, null, 'Click me!')
	const rendered = render(virtualNode)

	expect(rendered.node.rendered?.$$type).toBe('element')
	expect((rendered.node.rendered as VirtualElementNode)?.dom).toMatchInlineSnapshot(`
		<button
		  class="a b c d"
		>
		  Click me!
		</button>
	`)
})

test('render component inside component', () => {
	const Inner = ({ children }: { children: VirtualChildren }) => {
		return createElement('button', { className: 'a b c d' }, ...children)
	}

	const Wrapper = ({ children }: { children: VirtualChildren }) => {
		return createElement(Inner, null, ...children)
	}

	const virtualNode = createElement(Wrapper, null, 'Click me!')
	const rendered = render(virtualNode)

	expect(rendered.node.rendered?.$$type).toBe('component')
	expect((rendered.node.rendered as VirtualComponentNode).node.rendered?.$$type).toBe('element')
	expect(((rendered.node.rendered as VirtualComponentNode).node.rendered as VirtualElementNode)?.dom).toMatchInlineSnapshot(`
		<button
		  class="a b c d"
		>
		  Click me!
		</button>
	`)
})
