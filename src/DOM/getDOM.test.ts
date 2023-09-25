import { expect, test } from 'vitest'
import { render } from './render'
import { createElement } from '../vnode/createElement'
import { VirtualChildren } from '../types'
import { getDOM } from './getDOM'

test('getDOM of component inside component', () => {
	const Inner = ({ children }: { children: VirtualChildren }) => createElement('button', { onClick: () => console.log('click') }, ...children)
	const Wrapper = ({ children }: { children: VirtualChildren }) => createElement(Inner, null, ...children)
	const virtualNode = createElement(Wrapper, null, 'Hello world')
	const rendered = render(virtualNode)
	const dom = getDOM(rendered)

	expect(dom).toMatchInlineSnapshot(`
		<button>
		  Hello world
		</button>
	`)
})
