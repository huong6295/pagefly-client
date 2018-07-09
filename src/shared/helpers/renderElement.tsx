import {ElementContainer, ItemsContainer} from '../containers';
import React, {ReactNode} from 'react';
import {ElementComponents} from '../stores/elements';

export const renderElement = (id: string): ReactNode => {
	const container: ElementContainer = ItemsContainer.state[id]
	const type = container.state.type
	const Element = ElementComponents[type]
	return <Element {...{
		key: id,
		id,
		container
	}} />
}
