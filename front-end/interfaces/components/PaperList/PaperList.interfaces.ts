export type PaperListProps = {
	data: Array<any>
	toTranslate?: boolean
	checkBoxHandler: (id: number | string, checked: boolean, target: string, radio?: boolean) => any
	target: string
	radio: boolean
	pics?: Array<any>
	prefixTranslation?: string
}

export type FilterSelectionTypeItem = {
	id: number
	label: string
	active: boolean
}
