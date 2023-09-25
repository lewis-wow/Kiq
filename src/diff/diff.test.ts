import { expect, test } from 'vitest'
import { createElement } from '../vnode/createElement'
import { render } from '../DOM/render'
import { diff } from './diff'
import { VirtualElementNode, VirtualTextNode } from '../types'

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
