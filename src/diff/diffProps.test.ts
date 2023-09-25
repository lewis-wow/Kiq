import { expect, test } from 'vitest'
import { createElement } from '../vnode/createElement'
import { diffProps } from './diffProps'
import { render } from '../DOM/render'

test('diffProps className', () => {
	const virtualNode = createElement('div', { className: 'a b c d' }, 'Hello world!')
	const nextVirtualNode = createElement('div', { id: 'div-1' }, 'Hello world!')
	const rendered = render(virtualNode)

	const patch = diffProps(rendered.node.props, nextVirtualNode.props)

	expect(rendered.dom).toMatchInlineSnapshot(`
		<div
		  class="a b c d"
		>
		  Hello world!
		</div>
	`)

	patch(rendered.dom)

	expect(rendered.dom).toMatchInlineSnapshot(`
		<div
		  id="div-1"
		>
		  Hello world!
		</div>
	`)
})

test('diffProps dataset', () => {
	const virtualNode = createElement('div', { 'data-test': 'custom-data' }, 'Hello world!')
	const nextVirtualNode = createElement('div', null, 'Hello world!')
	const rendered = render(virtualNode)

	const patch = diffProps(rendered.node.props, nextVirtualNode.props)

	expect(rendered.dom).toMatchInlineSnapshot(`
		<div
		  data-test="custom-data"
		>
		  Hello world!
		</div>
	`)

	patch(rendered.dom)

	expect(rendered.dom).toMatchInlineSnapshot(`
		<div>
		  Hello world!
		</div>
	`)
})

test('diffProps style', () => {
	const virtualNode = createElement('div', { style: { color: 'red', textAlign: 'center' } }, 'Hello world!')
	const nextVirtualNode = createElement('div', null, 'Hello world!')
	const rendered = render(virtualNode)

	const patch = diffProps(rendered.node.props, nextVirtualNode.props)

	expect(rendered.dom).toMatchInlineSnapshot(`
		<div
		  style="color: red; text-align: center;"
		>
		  Hello world!
		</div>
	`)

	patch(rendered.dom)

	expect(rendered.dom).toMatchInlineSnapshot(`
		<div
		  style=""
		>
		  Hello world!
		</div>
	`)
})

test('diffProps style', () => {
	const virtualNode = createElement('div', null, 'Hello world!')
	const nextVirtualNode = createElement('div', { 'data-key': 'key', style: { textAlign: 'center' } }, 'Hello world!')
	const rendered = render(virtualNode)

	const patch = diffProps(rendered.node.props, nextVirtualNode.props)

	expect(rendered.dom).toMatchInlineSnapshot(`
		<div>
		  Hello world!
		</div>
	`)

	patch(rendered.dom)

	expect(rendered.dom).toMatchInlineSnapshot(`
		<div
		  data-key="key"
		  style="text-align: center;"
		>
		  Hello world!
		</div>
	`)
})
