import { Component, render, createElement } from './src/index.js'

class Counter extends Component {
	state = {
		count: this.props.count || 0,
	}

	Element(props, state) {
		return createElement('button', { onclick: () => this.setState({ count: state.count + 1 }) }, 'The count is: ', state.count)
	}
}

render(createElement(Counter, { count: 10 }), document.getElementById('app'))
