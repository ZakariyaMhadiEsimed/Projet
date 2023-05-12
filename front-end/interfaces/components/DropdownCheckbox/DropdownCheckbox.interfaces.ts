export type DropdownCheckboxProps = {
	data: Array<any>
	paperTopPosition?: number
	title: string
	toTranslate?: boolean
	rtl?: boolean
	selectActionsHandler: (id: number | string, checked: boolean, target: string, radio?: boolean) => any
	dropColor?: string
	submitOnClose?: () => any
	target: string
	radio?: boolean
	eraserColor?: string
	label?: string
	pics?: Array<any>
	prefixTranslation?: string
}

export type PaperWrapperProps = {
	topPosition?: number
	rtl?: boolean
	dataSize: number
	menuTransition: any
}
