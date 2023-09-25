import { expect, test } from 'vitest'
import { isFunctionalComponent } from './isFunctionalComponent'
import { createElement } from '../main'

test('isFunctionalComponent should be true with functional component', () => {
	const Button = () => createElement('button', null, 'Click me!')

	expect(isFunctionalComponent(Button)).toBe(true)
})

test('isFunctionalComponent should not be true without functional component', () => {
	expect(isFunctionalComponent('div')).toBe(false)
})
