import styled from 'styled-components'
import React from 'react'
import {createElement} from '../HOCs/createElement'

const SectionStyle = styled.section`

	border: orange 2px dashed;
	min-height: 50px;
	margin: 20px;

`
class Section extends React.Component<{ extraProps: object }> {
	static type = 'Section'

	render() {
		return <SectionStyle {...this.props.extraProps}>
			{this.props.children}
		</SectionStyle>
	}
}
// @ts-ignore
export default createElement({})(Section)