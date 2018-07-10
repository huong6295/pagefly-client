import React from 'react'
import styled from 'styled-components'
import {createElement} from '../HOCs/createElement'

const ButtonStyle = styled.button`
		border: 1px solid orange;
		border-radius: 10px;
`

class Button extends React.Component<{ extraProps: object }> {
	static type = 'Button'
	render() {
		return (
			<ButtonStyle {...this.props.extraProps}>
				BUTTON
			</ButtonStyle>
		)
	}
}
// @ts-ignore
export default createElement({})(Button)
