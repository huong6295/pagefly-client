import {StyleSheetManager} from 'styled-components'
import React from 'react'
import {createPortal} from 'react-dom'

type IFrameState = {
    root: Element
}

export default class IFrame extends React.Component<{head?: string, style?: object, onLoad: Function}, any> {

    get iframe() {
        return this.frame.current
    }

    get window() {
    	return this.iframe.contentWindow
	}
    get document() {
    	return this.iframe.contentDocument
	}

    state: IFrameState = {
        root: null
    }
    frame: React.RefObject<HTMLIFrameElement> = React.createRef()

    componentDidMount() {
        this.iframe.addEventListener('load', this.handleLoad, true)
    }

    componentWillUnmount() {
        this.iframe.removeEventListener('load', this.handleLoad, true)
    }

    handleLoad = (e: Event) => {
        const root = this.iframe.contentDocument.querySelector('html')
        this.iframe.contentDocument.body.remove()
        this.setState({root}, () => {
			this.props.onLoad(this)
        })
    }

    render() {
        return <iframe
            ref={this.frame}
            name="PageFly Editor Frame"
            srcDoc={`<!DOCTYPE html><html>
                        <head>
                            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                            <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
                            ${this.props.head}
                        </head></html>`}
            style={{
                border: 0,
                width: '100%',
                minHeight: 500,
                ...this.props.style
            }}
        >
            {this.state.root
            && createPortal(
                <StyleSheetManager target={this.iframe.contentDocument.head}>
					<body>{this.props.children}</body>
                </StyleSheetManager>,
                this.state.root
            )}
        </iframe>
    }
}