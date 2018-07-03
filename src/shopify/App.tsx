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
import {renderElement} from '../shared/helpers/renderElement';

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
						<script
  src="https://code.jquery.com/jquery-3.3.1.min.js"
  integrity="sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8="
  crossorigin="anonymous"></script>
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

					<h3>This is demo control inspector ...:</h3>
					{frame && <Inspector frame={frame} />}

				</div>
			</Provider>
		);
	}
}

export default App;
