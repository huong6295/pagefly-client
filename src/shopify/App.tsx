import React, {Component, MouseEvent} from 'react'
import {Provider} from 'unstated-x'
import {renderElement} from '../shared/HOCs/renderElement'
import {SelectedContainer} from '../shared/containers'

export const elementInstances = new Map()

class Page extends Component {

	handlePointerDown = (event: MouseEvent) => {
		event.stopPropagation()
		const target = event.target as HTMLElement
		const id = target.dataset.element
		const instance = elementInstances.get(id)
		console.log('check instance selected', instance)
		SelectedContainer.setState({
			selected: instance
			// selector: instance.selector
		})

	}

	render() {
		return (
			<div onMouseDown={this.handlePointerDown}>
				{this.props.children}
			</div>
		)
	}
}

export default class App extends Component {
	render() {
		return (
			<Provider>
				<div className="Application">
					<div style={{width: '60%', float: 'left'}}>
						<Page>
							{renderElement('0')}
						</Page>
					</div>
					<div style={{width: '30%', float: 'right'}}>
						<h1>Inspector</h1>
					</div>

				</div>
			</Provider>
		)
	}
}

