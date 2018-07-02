import {Container} from 'unstated-x';
import uuid from 'uuid';

export const SelectedContainer = new Container({
	selected: {container: Container}
})

type StateStyle =  {
	[selector: string]: string
}
export class StyleContainer extends Container<object> {
	instance: CSSStyleSheet;
	state: StateStyle = {}

	setStyle = (selector: string, style: object = {}) => {
		const cssRules = Array.from(this.instance.cssRules)
		let rule = cssRules.find((s: CSSStyleRule) => s.selectorText === selector ) as CSSStyleRule

		if (!rule) {
			const ruleIndex = this.instance.insertRule(`${selector} {}`)
			rule = this.instance.cssRules[ruleIndex] as CSSStyleRule
		}
		const currentStyle = rule.style
		Object.assign(currentStyle, style)
		Object.assign( this.state, {[selector]: style})
		console.log('new Style', currentStyle, this.state)
		this._listeners.forEach(fn => fn(style))
	}

	getStyle = (selector: string)  => {
		return this.state[selector] || {}
	}
}

export type ElementContainerState = {
	type: string
	children: Array<string|number>
	data: object
}

export class ElementContainer extends Container<ElementContainerState> {}

export type ItemIdType = string|number
export type ItemsState = {
	[id: string]: ElementContainer
}

const defaultItem = {
	[uuid()]: new ElementContainer({type: 'Section'})
}
export class Items extends Container<ItemsState> {
	state: ItemsState = defaultItem

	setInitialState = () => {
		this.setState({
			1: new ElementContainer({ type: 'Section', children: [2], data: {} }),
			2: new ElementContainer({ type: 'Button', children: [], data: {} })
		})
	}

	get firstItemKey() {
		return Object.keys(this.state)[0]
	}

	addItem = (options: {id?: ItemIdType, type: string, children: string[], data: {}}) => {
		let {id, ...rest} = options
		if (!id) {
			id = uuid()
		}
		return this.setState({[id]: new ElementContainer(rest)})
	}

}
export const ItemsContainer = new Items()
window.ItemsContainer = ItemsContainer
window.SelectedContainer = SelectedContainer