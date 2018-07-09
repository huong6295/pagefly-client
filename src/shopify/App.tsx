import React, {Component, DragEvent, StrictMode} from 'react';
import IFrame from 'components/IFrame';
import {Provider, Subscribe} from 'unstated-x';
import {addItemOptions, Items, ItemsContainer} from 'containers';
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

function getFilesFromDropEvent(ev: DragEvent) {
	let files = []
	if (ev.dataTransfer.items) {
		// Use DataTransferItemList interface to access the file(s)
		for (let i = 0; i < ev.dataTransfer.items.length; i++) {
			// If dropped items aren't files, reject them
			if (ev.dataTransfer.items[i].kind === 'file') {
				const file = ev.dataTransfer.items[i].getAsFile();
				files.push(file)
			}
		}
	} else {
		// Use DataTransfer interface to access the file(s)
		for (let i = 0; i < ev.dataTransfer.files.length; i++) {
			files.push(ev.dataTransfer.files[i])
		}
	}
	removeDragData(ev)

	return files
}

function removeDragData(ev: DragEvent) {
	if (ev.dataTransfer.items) {
		// Use DataTransferItemList interface to remove the drag data
		ev.dataTransfer.items.clear();
	} else {
		// Use DataTransfer interface to remove the drag data
		ev.dataTransfer.clearData();
	}
}

function readJsonFileAsText(file: File) {
	return new Promise(resolve => {
		const reader = new FileReader()
		reader.onload = e => {
			resolve(JSON.parse(e.target.result))
		}
		reader.readAsText(file)
	})
}

class Page extends React.Component {
	pageId: string = uuid()

	handleDragStart = (event: DragEvent) => {
		const target = event.target as HTMLElement
		const elementId = target.dataset.element
		const elementData = ItemsContainer.state[elementId]
		const parentId = target.parentElement.dataset.element
		const parentData = ItemsContainer.state[parentId]
		event.dataTransfer.setData('pagefly/element', JSON.stringify(
			{elementId,
				items: ItemsContainer.getElementData(elementId)
			}))
		event.dataTransfer.setData('elementId', elementId)
		event.dataTransfer.setData('parentId', parentId)
		event.dataTransfer.setData('DownloadURL', `application/json:text:` + window.URL.createObjectURL(
			new Blob([JSON.stringify(elementData.state)], {
				type: 'application/json'
			})
		))
	}

	handleDragOver = (event: DragEvent) => {
		event.preventDefault()
	}
	handleDrop = async (event: DragEvent) => {
		event.preventDefault()
		const target = event.target as HTMLElement
		const dropTargetId = target.dataset.element
		const elementData = event.dataTransfer.getData('pagefly/element')
		const allData = JSON.parse(elementData || '{}')
		console.log(1111, allData)
		const elementId = event.dataTransfer.getData('elementId')
		const parentId = event.dataTransfer.getData('parentId')
		const files = getFilesFromDropEvent(event)
		const newTargetContainer = ItemsContainer.state[dropTargetId]
		const newChilds = new Set(newTargetContainer.state.children)
		if (files.length) {
			const data = await readJsonFileAsText(files[0]) as addItemOptions
			console.log(222, 'drop from file',data)
			const newItem = await ItemsContainer.addItem(data)
			newChilds.add(newItem.state.id)
			newTargetContainer.setStateSync({children: [...newChilds]})
		} else {
			if (!dropTargetId || dropTargetId === parentId || dropTargetId === elementId) { return }
			const childContainer = ItemsContainer.state[elementId]
			if (!childContainer) {
				await ItemsContainer.addItem(allData.items[elementId])
			}
			newChilds.add(elementId)
			newTargetContainer.setState({children: [...newChilds]})
			const oldTargetContainer = ItemsContainer.state[parentId]
			!!oldTargetContainer && oldTargetContainer.setStateSync({children: oldTargetContainer.state.children.filter(c => c !== elementId)})
		}
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






