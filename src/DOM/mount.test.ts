import { expect, test } from 'vitest'
import { render } from './render'
import { createElement } from '../vnode/createElement'
import { mount } from './mount'
import { VirtualChildren } from '../types'

test('mount p virtual node into div container', () => {
	const divVirtualNode = createElement('p', { className: 'a b c d' }, 'Hello world')
	const rendered = render(divVirtualNode)
	const parentNode = document.createElement('div')
	const mounted = mount(rendered, parentNode)

	expect(mounted?.parentNode).toMatchInlineSnapshot(`
		<div>
		  <p
		    class="a b c d"
		  >
		    Hello world
		  </p>
		</div>
	`)
})

test('mount p virtual node into div container with replaceWith opeartion', () => {
	const divVirtualNode = createElement('p', { className: 'a b c d' }, 'Hello world')
	const rendered = render(divVirtualNode)

	const parentParentNode = document.createElement('div')
	parentParentNode.id = 'parentParentNode'
	const parentNode = document.createElement('div')
	parentNode.id = 'parentNode'
	parentParentNode.appendChild(parentNode)

	const mounted = mount(rendered, (el) => parentNode.replaceWith(el))

	expect(mounted?.parentNode).toMatchInlineSnapshot(`
		<div
		  id="parentParentNode"
		>
		  <p
		    class="a b c d"
		  >
		    Hello world
		  </p>
		</div>
	`)
})

test('mount component into div container', () => {
	const Button = ({ children }: { children: VirtualChildren }) => createElement('button', { onClick: () => console.log('click') }, ...children)
	const virtualNode = createElement(Button, null, 'Hello world')
	const rendered = render(virtualNode)

	const parentNode = document.createElement('div')

	const mounted = mount(rendered, parentNode)

	expect(mounted?.parentNode).toMatchInlineSnapshot(`
		<div>
		  <button>
		    Hello world
		  </button>
		</div>
	`)
})

test('mount component inside component into div container', () => {
	const Inner = ({ children }: { children: VirtualChildren }) => createElement('button', { onClick: () => console.log('click') }, ...children)
	const Wrapper = ({ children }: { children: VirtualChildren }) => createElement(Inner, null, ...children)
	const virtualNode = createElement(Wrapper, null, 'Hello world')
	const rendered = render(virtualNode)

	const parentNode = document.createElement('div')

	const mounted = mount(rendered, parentNode)

	expect(mounted?.parentNode).toMatchInlineSnapshot(`
		<div>
		  <button>
		    Hello world
		  </button>
		</div>
	`)
})
