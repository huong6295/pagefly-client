import {Container} from 'unstated-x';
import uuid from 'uuid';
import {PFElementInterface} from '../helpers/createElement';

class Selected extends Container<{}> {
	state: {
		selected?: PFElementInterface,
		selector?: string
	} = {}
}
export const SelectedContainer = new Selected()

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
	id?: string,
	type: string
	children?: Array<string|number>
	data?: object
}

export class ElementContainer extends Container<ElementContainerState> {}

export type ItemIdType = string|number
export type ItemsState = {
	[id: string]: ElementContainer
}
export type addItemOptions = {id?: ItemIdType, type: string, children?: string[], data?: {}}

const bodyKey = uuid()
const sectionKey = uuid()
const defaultItem = {
	[bodyKey]: new ElementContainer({type: 'Body', id: bodyKey, children: [sectionKey]}),
	[sectionKey]: new ElementContainer({type: 'Section',id: sectionKey, children: []}),
}
export class Items extends Container<ItemsState> {
	state: ItemsState = defaultItem

	get firstItemKey() {
		return Object.keys(this.state)[0]
	}

	addItem = async (options: addItemOptions): Promise<ElementContainer> => {
		if (!options.id) {
			options.id = uuid()
		}
		await this.setState({[options.id]: new ElementContainer(options)})
		return this.state[options.id]
	}

	getElementData = (id: string, data = {}): object => {
		const elementState = this.state[id] && this.state[id].state
		if (elementState) {
			data[id] = elementState
			if (Array.isArray(elementState.children) && elementState.children.length) {
				elementState.children.forEach((childId: string) => {
					data = this.getElementData(childId, data)
				})
			}
		}
		return data

	}

}
export const ItemsContainer = new Items()
window.ItemsContainer = ItemsContainer
window.SelectedContainer = SelectedContainer