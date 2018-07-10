import {Container} from 'unstated-x'
import {PFElementInterface} from '../HOCs/createElement'



/*
* Create a selected container to set selected and selector
* */
 class SLContainer extends Container<{}>{
	state : {
		selected?: PFElementInterface,
		selector?: string
	} = {}
}
export const SelectedContainer = new SLContainer()


/*
* Create a container for an element
* Create a ElementContainer to store all elements
*
* */
type ElementType = {
	id: string
	type: string
	children: Array<string>
	data: {}

}
export class ElementContainer extends Container<ElementType> {}

export const GlobalContainer = {
	0: new ElementContainer({
		type: 'Body',
		children: [1],
		data: {}
	}),
	1: new ElementContainer({
		type: 'Section',
		children: [2],
		data: {}
	}),
	2: new ElementContainer({
		type: 'Button',
		children: [],
		data: {}
	})
}