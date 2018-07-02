import React, {
	Component,
	ComponentType,
	createRef,
	EventHandler,
	FormEvent,
	ReactNode,
	ReactType,
	RefObject, SyntheticEvent
} from 'react';
import IFrame from 'components/IFrame';
import {Container, Provider, Subscribe} from 'unstated-x';
import {findDOMNode} from 'react-dom';
import {ElementContainer, Items, ItemsContainer, SelectedContainer} from 'containers';
import {createPFElement} from 'helpers/createElement';
import Inspector from 'inspectors';
import uuid from 'uuid'
import Section from '../shared/elements/Section';
import styled from 'styled-components';
import Button from '../shared/elements/Button';

window.uuid = uuid

const DragDropWrapper = styled.div`
	user-select: none;
	height: 70%;
	width: 70%;
	position: fixed;
	top: 0;
	left: 0;
	background-color: darkgray;
`

interface CustomDragEvent<HTMLElement> extends DragEvent{

}

class Page extends React.Component {

	handleDragStart = (event: SyntheticEvent) => {
		console.log(event.target)
	}

	render() {
		return <DragDropWrapper onDragStartCapture={this.handleDragStart}>
			{this.props.children}
		</DragDropWrapper>
	}
}

type ItemType = {
	id: string,
	type: string,
	data: {

	}
}
type ElementState = {
	items: ItemType[]
}

const ElementComponents: {
	[type: string]: {
		type: string
		load: Function
	}
} = {
	Paragraph: {
		type: 'Paragraph',
		load: () => import('elements/Paragraph.tsx')
	},
	Button: {
		type: 'Button',
		load: () => import('elements/Button.tsx')
	},
	Section: {
		type: 'Section',
		load: () => import('elements/Section.tsx')
	}
}

class ElementLoader extends React.Component<{type: string, id: string, data?: object, container?: ElementContainer}> {

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

export const renderElement = function (id: string): ReactNode {
	const container: ElementContainer = ItemsContainer.state[id]
	const type = container.state.type
	return <ElementLoader type={type} id={id} container={container} />
	console.log(container, type)
	return null
}

class App extends Component {

	state: {frame: IFrame} = {
		frame: null
	}

	render() {
		const {frame} = this.state
		return (
			<Provider>
				<div className="App">
					<IFrame head={`
						<style data-pagefly-css="all"></style>
						<style data-pagefly-css="mobile"></style>
					`} onLoad={(frame: IFrame) => {
						this.setState({frame})
					}}>
						<h3>This is demo Element</h3>
						<Subscribe to={[ItemsContainer]}>
							{(items: Items) => {
								if (!Object.keys(items.state).length) { return 'There is no items!' }
								return <Page>
									{renderElement(items.firstItemKey)}
								</Page>
							}}
						</Subscribe>

					</IFrame>

					<h3>This is demo control inspector:</h3>
					{frame && <Inspector frame={frame} />}

				</div>
			</Provider>
		);
	}
}

export default App;
