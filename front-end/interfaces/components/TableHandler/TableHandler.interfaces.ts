import { Dispatch, MutableRefObject, SetStateAction } from 'react'

export type tableConfigProps = {
	getComparator: { (sortColumn: string): (a: any, b: any) => number }
	tableTitle?: string
	rowSizing?: string
	searchBarComponent: searchBarComponentProps
	defaultSort?: { columnKey: string; direction: 'ASC' | 'DESC' }
}

export type searchBarComponentProps = {
	handleSearchEnter: (e: any, val: string) => void
	handleClickSearch: (refInput: MutableRefObject<any>) => void
	placeholder: string
	defaultValue: string | undefined
	handleReset: (refInput: MutableRefObject<any>) => void
	setSearchValue?: Dispatch<SetStateAction<string | undefined>>
}

export type columnProps = {
	dataHook?: string
	component?: any
	action?: boolean
	actionsList?: Array<any>
	rest?: any
	requiredRight?: string
}
