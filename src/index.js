import createElement from './vnode/createElement.js'
import Component from './vnode/component/component.js'
import mount from './DOM/mount.js'
import renderDOM from './DOM/render.js'
import errorReport from './errorReporting.js'

function renderToPage(virtualElement, container, callback) {
	window.requestAnimationFrame(() => {
		if (!container || container.nodeType !== Node.ELEMENT_NODE) {
			throw errorReport('render(...)', `container must be valid Element that is already rendered on page`)
		}

		const newNodeDefinition = renderDOM(virtualElement)
		callback(newNodeDefinition)
	})
}

function render(virtualElement, container, callback) {
	renderToPage(virtualElement, container, (newNodeDefinition) => {
		mount(newNodeDefinition, container, () => container.appendChild(newNodeDefinition.realDOM))

		if (callback) callback(newNodeDefinition)
	})
}

export { render, Component, createElement }
