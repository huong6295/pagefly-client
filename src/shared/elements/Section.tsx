import styled from 'styled-components';
import React from 'react'

import createPFElement from '../helpers/createElement';
import {renderElement} from '../helpers/renderElement';

const S = styled.section`

	border: cyan 1px dotted;
	min-height: 20px;

`

class Section extends React.Component<any> {
	static type = 'Section'
	render() {
		console.log('section props', this.props)
		return <S {...this.props.extraProps}>

			<div className="container">
				{React.Children.map(this.props.children, renderElement)}
			</div>
		</S>
	}

}

export default createPFElement({})(Section)