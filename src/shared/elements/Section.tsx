import styled from 'styled-components';
import React from 'react'

import createPFElement from '../helpers/createElement';
import {renderElement} from '../helpers/renderElement';

const S = styled.section`

	border: red 1px dashed;
	min-height: 50px;
	margin: 20px;

`

class Section extends React.Component<{extraProps: object}> {
	static type = 'Section'
	render() {
		return <S {...this.props.extraProps}>

			{React.Children.map(this.props.children, renderElement)}

		</S>
	}

}

export default createPFElement({})(Section)