import Kiq from '../src/main'

export interface AsyncProps {
	promise: () => Promise<any>
	then: (data: any) => any
}

export default class Async extends Kiq.Component {
	state = {
		data: null,
	}

	constructor(props: AsyncProps) {
		super(props)
	}

	onComponentRender() {
		this.props.promise().then((data) => this.setState({ data: data }))
	}

	Element() {
		if (this.state.data !== null) return this.props.then(this.state.data)

		return this.props.children[0]
	}
}
