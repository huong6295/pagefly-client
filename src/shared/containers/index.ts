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

const defaultItem = {
	'0-body': new ElementContainer({type: 'Body', children: ['1-section','2-section','3-section']}),
	'1-section': new ElementContainer({type: 'Section', children: ['4-button']}),
	'2-section': new ElementContainer({type: 'Section'}),
	'3-section': new ElementContainer({type: 'Section'}),
	'4-button': new ElementContainer({type: 'Button'})
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

	addItem = async (options: {id?: ItemIdType, type: string, children?: string[], data?: {}}): Promise<ElementContainer> => {
		if (!options.id) {
			options.id = uuid()
		}
		await this.setState({[options.id]: new ElementContainer(options)})
		return this.state[options.id]
	}

}
export const ItemsContainer = new Items()
window.ItemsContainer = ItemsContainer
window.SelectedContainer = SelectedContainer