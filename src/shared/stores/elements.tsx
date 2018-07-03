
const ElementComponents: {
	[type: string]: {
		type: string
		load: Function
	}
} = {
	Paragraph: {
		type: 'Paragraph',
		load: () => import('elements/Paragraph.tsx')
	},
	Button: {
		type: 'Button',
		load: () => import('elements/Button.tsx')
	},
	Section: {
		type: 'Section',
		load: () => import('elements/Section.tsx')
	}
}

export default ElementComponents