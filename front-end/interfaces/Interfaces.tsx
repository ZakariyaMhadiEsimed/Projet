//  LOGIN PAGE
export interface ButtonCssProps {
	//marginBottom?:number,
	backgroundColor?: string
	hoverBackgroundColor?: string
	percentUnit?: boolean
	fontSize?: string
	disabled?: boolean
	marginBottom?: number
	hoverColor?: string
	icon?: string
}

// GLOBAL CSS ICON SQUARE
export interface IconSquareCssProps {
	name?: any
	height?: number
	width?: number
	backgroundColor?: string
	hoverBackgroundColor?: string
	toggledBackgroundColor?: string
	backgroundImage?: string
	margin?: string
	onClick?: any
	isToggled?: boolean
	toggledBackgroundImage?: string
	isBase64?: boolean
}

//  MODAL PAPER
export interface ModalPaperCssProps {
	paperWidth?: number
	paperHeight?: number
	levelBgColor?: string
	overflow?: boolean
}
export interface ModalButtonWrapperProps {
	multiple?: boolean
	flex?: string
}

export interface PageWrapperProps {
	noFilters?: boolean
}

export interface ContentWrapperProps {
	displayMode?: 'plain' | 'list'
}

export interface ModalsBodyContainerProps {
	hasTitle?: boolean
}

export interface StyledInputProps {
	hasError?: boolean
}

export interface SelectInputWrapperProps {
	width?: number
	heightAfter?: number
	reverseMode?: boolean
	alignItems?: string
	hasError?: boolean
}

export interface SelectInputProps {
	width?: number
	reverseMode?: boolean
	placeholderColor?: string
	defaultValues?: string
}

export interface FormHandlerProps {
	formCols: number
}

export interface OptionCustomProps {
	target?: boolean
}
