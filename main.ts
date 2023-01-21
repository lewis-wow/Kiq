import Kiq from './src/main'
import Async from './components/Async'

class Prefix extends Kiq.Component {
	state = {
		arr: this.props.start || [],
	}

	onComponentRender() {
		setInterval(() => {
			this.setState({
				arr: [this.state.arr.length, ...this.state.arr],
			})
		}, 1000)
	}

	Element() {
		return Kiq.createElement('ol', null, ...this.state.arr.map((item) => Kiq.createElement('li', { key: item }, item)))
	}
}

class Counter extends Kiq.Component {
	state = {
		count: 0,
	}

	Element() {
		return Kiq.createElement('button', { onclick: () => this.setState({ count: this.state.count + 1 }) }, 'The count is: ', this.state.count)
	}
}

class NoKeysPrefix extends Kiq.Component {
	state = {
		arr: this.props.start || [],
	}

	onComponentRender() {
		setInterval(() => {
			this.setState({
				arr: [this.state.arr.length, ...this.state.arr],
			})
		}, 1000)
	}

	Element() {
		return Kiq.createElement('ol', null, ...this.state.arr.map((item) => Kiq.createElement('li', null, item)))
	}
}

class Parent extends Kiq.Component {
	state = {
		count: 0,
	}

	Element() {
		return Kiq.createElement(Child, { increment: () => this.setState({ count: this.state.count + 1 }), count: this.state.count })
	}
}

class Child extends Kiq.Component {
	Element() {
		return Kiq.createElement('button', { onclick: () => this.props.increment() }, 'The count is: ', this.props.count)
	}
}

class ParentList extends Kiq.Component {
	state = {
		arr: [],
	}

	onComponentRender() {
		setInterval(() => {
			this.setState({
				arr: [...this.state.arr, this.state.arr.length],
			})
		}, 1000)
	}

	Element() {
		return Kiq.createElement('ol', null, ...this.state.arr.map((item) => Kiq.createElement(ChildListItem, { key: item, count: item })))
	}
}

class ChildListItem extends Kiq.Component {
	state = {
		count: this.props.count,
	}

	Element() {
		return Kiq.createElement('li', null, this.state.count)
	}
}

const timeout = (ms: number) => new Promise((resolve) => setTimeout(() => resolve('data'), ms))

class Test extends Kiq.Component {
	Element() {
		return Kiq.createElement(Async, { promise: () => timeout(1000), then: (data) => Kiq.createElement('div', null, data) }, 'Loading...')
	}
}

class Condition extends Kiq.Component {
	state = {
		guard: false,
	}

	Element() {
		return Kiq.createElement(
			'div',
			null,
			Kiq.createElement('button', { onclick: () => this.setState({ guard: !this.state.guard }) }, 'Toggle'),
			Kiq.createElement('div', null, this.state.guard ? Kiq.createElement('div', null, 'Guard is ', 'true') : Kiq.createElement(UnMount)),
		)
	}
}

class UnMount extends Kiq.Component {
	onComponentRender() {
		console.log('render')
	}

	onComponentWillUnMount() {
		console.log('unmount')
	}

	Element() {
		return Kiq.createElement('div', null, 'Guard is ', 'false')
	}
}

class Remove extends Kiq.Component {
	state = {
		condition: false,
	}

	onComponentRender() {
		setInterval(() => {
			this.setState({
				condition: !this.state.condition,
			})
		}, 2000)
	}

	Element() {
		return Kiq.createElement('div', null, this.state.condition ? null : 'hello')
	}
}

const app = document.getElementById('app') as HTMLElement

//Kiq.render(Kiq.createElement(Prefix), app)
//Kiq.render(Kiq.createElement(Counter), app)
//Kiq.render(Kiq.createElement(NoKeysPrefix, { start: [1, 2, 3] }), app)
//Kiq.render(Kiq.createElement(Parent), app)
//Kiq.render(Kiq.createElement(ParentList), app)
//Kiq.render(Kiq.createElement(Test), app)
//Kiq.render(Kiq.createElement(Condition), app)
Kiq.render(Kiq.createElement(Remove), app)
