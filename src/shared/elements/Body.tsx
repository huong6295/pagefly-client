import styled from 'styled-components';
import React from 'react'
import createPFElement from '../helpers/createElement';
import {renderElement} from '../helpers/renderElement';

const Div = styled.div`

	border: red 1px dashed;
	min-height: 100px;

`

class Body extends React.Component<{ extraProps: object }> {
	static type = 'Body'

	render() {
		console.log('body props', this.props)
		return <Div {...this.props.extraProps}>
			{React.Children.map(this.props.children, renderElement)}
		</Div>
	}

}

export default createPFElement({})(Body)