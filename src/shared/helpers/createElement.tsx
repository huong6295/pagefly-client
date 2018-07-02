import React, {Component, ComponentClass, ComponentElement, FormEvent, RefObject} from 'react';
import {Container, Subscribe} from 'unstated-x';
import {ElementContainer, SelectedContainer} from 'containers';
import uuid from 'uuid';

export interface PFElementInterface extends ComponentClass{
	type: string
}
type ElementProps = {
	type: string,
	data: object,
	id?: string,
	container: ElementContainer
}

export const elementInstances = new Map()

window.elementInstances = elementInstances

export const createPFElement = (settings: object) => (Element: PFElementInterface) => {

	return class PFElement extends Component<ElementProps, any> {
		stateContainer: ElementContainer = this.props.container
		DOMNodeRef: RefObject<HTMLElement> = React.createRef()
		elementRef: RefObject<Component> = React.createRef()
		styledRefs: RefObject<Component> = React.createRef()
		id: string = this.props.id || uuid()
		static type = Element.type
		constructor(props: ElementProps, context: object) {
			super(props, context)

			console.log(111, this.props)
		}


		componentDidUpdate(prevProps: ElementProps) {

			if (prevProps.data !== this.props.data) {
				this.stateContainer.setStateSync(this.props.data)
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
			console.log('mouse down', this)
			SelectedContainer.setState({
				selected: this,
				selector: this.selector
			})
			window.selected = this
		}

		render() {
			const className = 'pf-' + this.id.split('-')[0]
			return (
				<Subscribe to={[this.stateContainer]}>
					{(stateContainer) => {
						return <Element
							{...stateContainer.state.data}
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