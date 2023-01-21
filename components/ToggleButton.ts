import Kiq from '../src/main'

export interface ToggleButtonProps {
	onToggle: (active: boolean) => void
}

export default class ToggleButton extends Kiq.Component {
	state = {
		active: false,
	}

	constructor(props: ToggleButtonProps) {
		super(props)
	}

	toggle() {
		this.setState({ active: !this.state.active })
		this.props.onToggle(this.state.active)
	}

	Element() {
		return Kiq.createElement('button', { onclick: () => this.toggle() }, ...this.props.children)
	}
}
