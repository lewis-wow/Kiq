import { expect, test } from 'vitest'
import { createElement } from '../vnode/createElement'
import { render } from '../DOM/render'
import { diff } from './diff'
import { VirtualElementNode, VirtualTextNode } from '../types'
import { getDOM } from '../DOM/getDOM'

test('replace div with p', () => {
	const virtualNode = createElement('div', { className: 'a b c d' }, 'Hello world!')
	const nextVirtualNode = createElement('p', { id: 'div-1' }, 'Hello me!')
	const rendered = render(virtualNode)
	const parentNode = document.createElement('div')
	parentNode.appendChild(rendered.dom)

	const patch = diff(rendered, nextVirtualNode)

	expect(rendered.dom).toMatchInlineSnapshot(`
		<div
		  class="a b c d"
		>
		  Hello world!
		</div>
	`)

	const patched = patch(rendered.dom) as VirtualElementNode

	expect(patched.dom).toMatchInlineSnapshot(`
		<p
		  id="div-1"
		>
		  Hello me!
		</p>
	`)
})

test('replace div with text', () => {
	const virtualNode = createElement('div', { className: 'a b c d' }, 'Hello world!')
	const nextVirtualNode = 'Hello me!'
	const rendered = render(virtualNode)
	const parentNode = document.createElement('div')
	parentNode.appendChild(rendered.dom)

	const patch = diff(rendered, nextVirtualNode)

	expect(rendered.dom).toMatchInlineSnapshot(`
		<div
		  class="a b c d"
		>
		  Hello world!
		</div>
	`)

	const patched = patch(rendered.dom) as VirtualTextNode

	expect(patched.dom).toMatchInlineSnapshot('Hello me!')
})

test('replace component with text', () => {
	const Button = () => createElement('button', { className: 'a b c d' }, 'Click me!')
	const virtualNode = createElement(Button)
	const nextVirtualNode = 'Hello me!'
	const rendered = render(virtualNode)
	const parentNode = document.createElement('div')
	parentNode.appendChild(getDOM(rendered)!)

	const patch = diff(rendered, nextVirtualNode)

	expect(getDOM(rendered)).toMatchInlineSnapshot(`
		<button
		  class="a b c d"
		>
		  Click me!
		</button>
	`)

	const patched = patch({ parentNode: null })

	expect(getDOM(patched)).toMatchInlineSnapshot('Hello me!')
})

test('replace component with element', () => {
	const Button = () => createElement('button', { className: 'a b c d' }, 'Click me!')
	const virtualNode = createElement(Button)
	const nextVirtualNode = createElement('div', { className: 'a b c d' }, 'Click me!')
	const rendered = render(virtualNode)
	const parentNode = document.createElement('div')
	parentNode.appendChild(getDOM(rendered)!)

	const patch = diff(rendered, nextVirtualNode)

	expect(getDOM(rendered)).toMatchInlineSnapshot(`
		<button
		  class="a b c d"
		>
		  Click me!
		</button>
	`)

	const patched = patch({ parentNode: null })

	expect(getDOM(patched)).toMatchInlineSnapshot(`
		<div
		  class="a b c d"
		>
		  Click me!
		</div>
	`)
})

test('replace component with element, but change only className', () => {
	const Button = () => createElement('button', { className: 'a b c d' }, 'Click me!')
	const virtualNode = createElement(Button)
	const nextVirtualNode = createElement('button', { className: 'class' }, 'Click me!')
	const rendered = render(virtualNode)
	const parentNode = document.createElement('div')
	parentNode.appendChild(getDOM(rendered)!)

	const patch = diff(rendered, nextVirtualNode)

	expect(getDOM(rendered)).toMatchInlineSnapshot(`
		<button
		  class="a b c d"
		>
		  Click me!
		</button>
	`)

	const patched = patch({ parentNode: null })

	expect(getDOM(patched)).toMatchInlineSnapshot(`
		<button
		  class="class"
		>
		  Click me!
		</button>
	`)
})

test('Same component but another props', () => {
	const Button = ({ condition }: { condition: boolean }) => createElement('button', { className: 'a b c d' }, condition ? 'Click me!' : 'Not clickable!')
	const virtualNode = createElement(Button, { condition: true })
	const nextVirtualNode = createElement(Button, { condition: false })
	const rendered = render(virtualNode)
	const parentNode = document.createElement('div')
	parentNode.appendChild(getDOM(rendered)!)

	const patch = diff(rendered, nextVirtualNode)

	expect(getDOM(rendered)).toMatchInlineSnapshot(`
		<button
		  class="a b c d"
		>
		  Click me!
		</button>
	`)

	const patched = patch({ parentNode: null })

	expect(getDOM(patched)).toMatchInlineSnapshot(`
		<button
		  class="a b c d"
		>
		  Not clickable!
		</button>
	`)
})
