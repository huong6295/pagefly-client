import React, {Component, ComponentClass} from 'react'
import {Subscribe} from 'unstated-x'
import {ElementContainer} from 'containers'
import uuid from 'uuid'
import {renderElement} from './renderElement'
import {elementInstances} from '../../shopify/App'

export interface ElementInterface extends ComponentClass {
	type?: string
}

type ElementProps = {
	type: string,
	data: object,
	id?: string,
	container: ElementContainer
}

export interface PFElementInterface extends Component {
	stateContainer: ElementContainer;
}

export const createElement = () => (Element: ElementInterface): ComponentClass => {

	return class PFElement extends Component<ElementProps, any> implements PFElementInterface {
		id: string = this.props.id || uuid()
		static type = Element.type

		get stateContainer() {
			return this.state.container
		}
		componentDidMount() {
			elementInstances.set(this.id, this)
		}
		componentDidUpdate(prevProps: ElementProps) {
			if (prevProps.container !== this.props.container) {
				this.setState({container: this.props.container})
			}
		}

		render() {
			const {container} = this.props
			return (
				<Subscribe to={[container]}>
					{(stateContainer) => {
						return <Element
							{...stateContainer.state}
							onChange={(value: object) => {
								stateContainer.setState(value)
							}}
							extraProps={{
								draggable: true,
								'data-element': this.id
							}}
						>
							{(stateContainer.state.children || []).map(renderElement)}
						</Element>
					}}
				</Subscribe>
			)
		}

	}
}

export default createElement