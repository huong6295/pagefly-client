import React, {Component, DragEvent} from 'react';
import IFrame from 'components/IFrame';
import {Provider, Subscribe} from 'unstated-x';
import {Items, ItemsContainer} from 'containers';
import Inspector from 'inspectors';
import uuid from 'uuid'
import styled from 'styled-components';
import {renderElement} from '../shared/helpers/renderElement';

window.uuid = uuid

const DragDropWrapper = styled.div`
	user-select: none;
	height: 100%;
	width: 100%;
	position: fixed;
	top: 0;
	left: 0;
	background-color: darkgray;
`

class Page extends React.Component {

	handleDragStart = (event: DragEvent) => {
		const target = event.target as HTMLElement
		const elementId = target.dataset.element
		const elementData = ItemsContainer.state[elementId]
		const parentId = target.parentElement.dataset.element
		const parentData = ItemsContainer.state[parentId]
		event.dataTransfer.setData('elementId', elementId)
		event.dataTransfer.setData('parentId', parentId)
		console.log('drag start ', elementData.state, 'from parent:', parentData.state)
		event.dataTransfer.setData('DownloadURL', `application/json:text:` + window.URL.createObjectURL(
			new Blob([JSON.stringify(elementData.state)], {
				type: 'application/json'
			})
		))
	}

	handleDragOver = (event: DragEvent) => {
		event.preventDefault()
		// console.log('drag over', event.dataTransfer)
	}
	handleDrop = (event: DragEvent) => {
		const target = event.target as HTMLElement
		const dropTargetId = target.dataset.element
		const elementId = event.dataTransfer.getData('elementId')
		const parentId = event.dataTransfer.getData('parentId')
		console.log('handleDrop', 'dropTargetId', dropTargetId, 'elementId', elementId, 'parentId', parentId)
		if (dropTargetId === parentId) return
		const newTargetContainer = ItemsContainer.state[dropTargetId]
		const oldTargetContainer = ItemsContainer.state[parentId]

		const newChilds = new Set(newTargetContainer.state.children)
		newChilds.add(elementId)
		newTargetContainer.setStateSync({children: [...newChilds]})

		oldTargetContainer.setStateSync({children: oldTargetContainer.state.children.filter(c => c !== elementId)})

	}

	render() {
		return <DragDropWrapper
			onDragStart={this.handleDragStart}
			onDragOverCapture={this.handleDragOver}
			onDropCapture={this.handleDrop}
		>
			{this.props.children}
		</DragDropWrapper>
	}
}


class App extends Component {

	state: { frame: IFrame } = {
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
						<script src="https://code.jquery.com/jquery-3.3.1.min.js"></script>
					`} onLoad={(frame: IFrame) => {
						this.setState({frame})
					}}>
						<h3>This is demo Element</h3>
						<Subscribe to={[ItemsContainer]}>
							{(items: Items) => {
								if (!Object.keys(items.state).length) {
									return 'There is no items!'
								}
								return <Page>
									{renderElement(items.firstItemKey)}
								</Page>
							}}
						</Subscribe>

					</IFrame>

					<h3>This is demo control inspector ...:</h3>
					{frame && <Inspector frame={frame}/>}

				</div>
			</Provider>
		);
	}
}

export default App;
