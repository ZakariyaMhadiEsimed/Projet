////////LIBRARY/////////
import { useState } from 'react'
import { cloneDeep, isEqual, forEach, findIndex, isUndefined, find } from 'lodash'
///////COMPONENTS///////
import { HeaderFilters } from '../../interfaces/components/PageActions/PageActions.interfaces'

/*(
	| HeaderFilters
	| undefined
	| Dispatch<SetStateAction<HeaderFilters | undefined>>
	| ((id: string | number, checked: boolean, target: string, radio: boolean) => void)
	| any
)[]*/
// TODO : Provide a better return type than any ?

const UseCheckAll = (prevFilters: HeaderFilters | undefined, submitMethod: any | undefined): any => {

	const [filters, setFilters] = useState<HeaderFilters | undefined>()

	///////////////////////////////// HANDLE ///////////////////////////////////////

	const handleCheckElements = (id: string | number, checked: boolean, target: any): void => {
		const filtersCP = cloneDeep(filters)
		//const targetedObj = find(filtersCP?.filtersSelection, { name: target })
		const targetedObj = find(filtersCP?.filtersSelection, (o, k) => {
			return k === target
		})
		const prevTargetedObj = find(prevFilters?.filtersSelection, (o, k) => k === target)
		if (!isUndefined(filtersCP?.filtersSelection)) {
			if (id === 'checkAll') {
				forEach(filtersCP?.filtersSelection[target].filterElements, (elem): void => {
					if (elem.id !== 'checkAll') elem.active = !checked
				})
			} else {
				if (!isUndefined(targetedObj)) {
					const idx = findIndex(targetedObj.filterElements, { id: id })
					targetedObj.filterElements[idx].active = !checked
				}
			}
			if (!isUndefined(targetedObj) && !isUndefined(prevTargetedObj)) {
				if (!isEqual(targetedObj.filterElements, prevTargetedObj.filterElements)) {
					targetedObj.updated = true
				} else {
					targetedObj.updated = false
				}
			}
		}
		setFilters(filtersCP)
	}

	const handleCheckRadio = (id: string | number, checked: boolean, target: any): void => {
		const filtersCP = cloneDeep(filters)
		if (!isUndefined(filtersCP?.filtersSelection)) {
			forEach(filtersCP?.filtersSelection[target].filterElements, (elem): void => {
				elem.selected = elem.id === id
			})
			if (!isUndefined(filtersCP?.filtersSelection[target]) && !isUndefined(filters?.filtersSelection)) {
				if (!isEqual(filtersCP?.filtersSelection[target].filterElements, filters?.filtersSelection[target].filterElements)) {
					const targetedObj = filtersCP?.filtersSelection[target]
					targetedObj.updated = true
				}
			}
			if (!isUndefined(submitMethod)) submitMethod(filtersCP)
		}
		setFilters(filtersCP)
	}

	const handleCheck = (id: string | number, checked: boolean, target: string, radio: boolean): void => {
		if (radio) {
			handleCheckRadio(id, checked, target)
		} else {
			handleCheckElements(id, checked, target)
		}
	}

	// TODO : Functions below might be useless in project
	/*const handleCheckSort = (sortItem: SortItemType): void => {
		const filtersCP = cloneDeep(filters)
		const targetedObj = find(filtersCP?.sortingSelection, { name: sortItem.name })
		if (!isUndefined(targetedObj)) {
			forEach(filtersCP?.sortingSelection, (item: SortItemType) => {
				if (item.name !== sortItem.name) {
					item.selected = false
					item.ordering = 'ASC'
				} else {
					if (!item.selected) {
						item.selected = true
					} else {
						if (item.ordering === 'ASC') {
							item.ordering = 'DESC'
						} else {
							item.ordering = 'ASC'
						}
					}
				}
			})
		}
		setFilters(filtersCP)
	}
	*/
	const handleCheckDate = (checked: boolean): void => {
		const filtersCP = cloneDeep(filters)
		if (!isUndefined(filtersCP) && !isUndefined(filtersCP.dateFilter)) {
			//filtersCP.dateFilter.selected = !checked
		}
		setFilters(filtersCP)
	}

	return [filters, setFilters, handleCheck, handleCheckDate /*handleCheckSort*/]
}

export default UseCheckAll
