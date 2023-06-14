export type HeaderFilters = {
	filtersSelection?: Array<any>
	dateFilter?: {
		dateRange: {
			startingDate: string
			endingDate: string
		}
		//selected: boolean
		//updated: boolean
	}
	searchField?: null | string
	searchFieldUpdate?: null | boolean
	withFilters: boolean
	//sortingSelection?: Array<any>
}

export type PageActionsProps = {
	pageActionsConfig: any
	filtersState?: HeaderFilters
}
