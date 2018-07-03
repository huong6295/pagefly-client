import {ElementContainer, ItemsContainer} from '../containers';
import React, {Component, ReactNode} from 'react';
import ElementComponents from '../stores/elements';

export class ElementLoader extends React.Component<{type: string, id: string, data?: object, container?: ElementContainer}> {

	state = {
		Instance: (): Component => null
	}

	componentDidMount() {
		this.loadElement()
	}

	componentDidUpdate(prevProps: {type: string}) {
		console.log('did update')
		if (prevProps.type !== this.props.type) {
			this.loadElement()
		}
	}

	loadElement = async () => {
		const {type} = this.props
		const Instance = (await ElementComponents[type].load()).default
		this.setState({Instance})
		console.log('loaded', this.props)
	}

	render() {
		const {Instance} = this.state
		return <Instance {...this.props} />
	}
}

export const renderElement = (id: string): ReactNode => {
	const container: ElementContainer = ItemsContainer.state[id]
	const type = container.state.type
	return <ElementLoader type={type} id={id} container={container} />
}