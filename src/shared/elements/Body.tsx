import styled from 'styled-components'
import React from 'react'
import {createElement} from '../HOCs/createElement'

const BodyStyle = styled.div`
	border: black 2px dashed;
	min-height: 100px;

`

class Body extends React.Component<{ extraProps: object }> {
	static type = 'Body'

	render() {
		return <BodyStyle {...this.props.extraProps}>
			{this.props.children}
		</BodyStyle>
	}
}

// @ts-ignore
export default createElement({})(Body)