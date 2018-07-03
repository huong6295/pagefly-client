import React, {Component, ComponentClass, RefObject} from 'react';
import {Subscribe} from 'unstated-x';
import {ElementContainer, SelectedContainer} from 'containers';
import uuid from 'uuid';

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

export const elementInstances = new Map()

window.elementInstances = elementInstances

export const createPFElement = (settings: object) => (Element: ElementInterface): ComponentClass => {

	return class PFElement extends Component<ElementProps, any> implements PFElementInterface {
		DOMNodeRef: RefObject<HTMLElement> = React.createRef()
		elementRef: RefObject<Component> = React.createRef()
		styledRefs: RefObject<Component> = React.createRef()
		id: string = this.props.id || uuid()
		static type = Element.type

		constructor(props: ElementProps, context: object) {
			super(props, context)

			this.state = {
				container: props.container
			}
		}
		get stateContainer() {
			return this.state.container
		}

		componentDidUpdate(prevProps: ElementProps) {
			console.log('did update', prevProps)
			if (prevProps.container !== this.props.container) {
				this.setState({container: this.props.container})
			}
		}

		get element() {
			return this.elementRef.current
		}

		get DOMNode() {
			return this.DOMNodeRef.current
		}

		get selector() {
			return Array.from(this.DOMNode.classList).map(s => `.${s}`).join('')
		}

		get computedStyle() {
			return getComputedStyle(this.DOMNode)
		}

		handlePointerDown = (e: MouseEvent) => {
			e.stopPropagation()
			if (SelectedContainer.state.selected !== this) {
				console.log('mouse down', Element.type)
				SelectedContainer.setState({
					selected: this,
					selector: this.selector
				})
				window.selected = this
			}
		}

		render() {
			const className = 'pf-' + this.id.split('-')[0]
			const {container} = this.state
			return (
				<Subscribe to={[container]}>
					{(stateContainer) => {
						return <Element
							{...stateContainer.state}
							children={stateContainer.state.children}
							onChange={(value: object) => {
								console.log('onChange', value)
								stateContainer.setState(value)
							}}
							extraProps={{
								onPointerDown: this.handlePointerDown,
								innerRef: this.DOMNodeRef,
								ref: this.styledRefs,
								className,
								draggable: true,
								'data-element': this.id

							}}
							ref={this.elementRef}
						/>
					}}
				</Subscribe>
			)
		}

	}

}

export default createPFElement