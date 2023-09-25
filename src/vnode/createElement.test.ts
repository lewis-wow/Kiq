import { expect, test } from 'vitest'
import { createElement } from './createElement'
import { Ref } from '../types'

test('createElement with div type', () => {
	expect(createElement('div', { className: 'a b c' }, 'Hello world')).toStrictEqual({
		type: 'div',
		props: {
			className: 'a b c',
			children: ['Hello world'],
		},
		key: undefined,
		ref: undefined,
	})
})

test('createElement with Button component type', () => {
	type ButtonProps = {
		message: string
	}

	const Button = ({ message }: ButtonProps) => createElement('button', { onClick: () => console.log(message) }, 'Click me!')

	expect(createElement(Button, { message: 'Hello world' })).toStrictEqual({
		type: Button,
		props: {
			message: 'Hello world',
			children: [],
		},
		key: undefined,
		ref: undefined,
	})
})

test('createElement div type with key', () => {
	expect(createElement('div', { className: 'a b c', key: 1 }, 'Hello world')).toStrictEqual({
		type: 'div',
		props: {
			className: 'a b c',
			children: ['Hello world'],
		},
		key: 1,
		ref: undefined,
	})
})

test('createElement div type with ref', () => {
	const ref: Ref<HTMLDivElement> = (el) => console.log(el)

	expect(createElement('div', { className: 'a b c', ref }, 'Hello world')).toStrictEqual({
		type: 'div',
		props: {
			className: 'a b c',
			children: ['Hello world'],
		},
		key: undefined,
		ref: ref,
	})
})
