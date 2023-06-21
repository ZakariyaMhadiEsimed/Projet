////////LIBRARY/////////
import { cloneDeep, isUndefined } from 'lodash'
import { NextPage } from 'next'
import cookies from 'next-cookies'
import React, { MutableRefObject, useEffect, useState } from 'react'
import { Column } from 'react-data-grid'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { bindActionCreators } from 'redux'
///////COMPONENTS///////
import { queryParamPagingProps } from '../../components/Paging/Paging'
import TableHandler from '../../components/TableHandler'
import API_TOKEN from '../../config/AxiosConfig'
import * as R from '../../constants/Endpoint'
import Store from '../../helpers/Store'
import { tableConfigProps } from '../../interfaces/components/TableHandler/TableHandler.interfaces'
import { errorManagerActionCreators, globalLoadingActionCreators } from '../../store/actions'
import { useForm } from 'react-hook-form'
import ModalAdd from '../../components/Customers/ModalAdd'
import ActionsTable from '../../components/ActionsTable'
import ModalDelete from '../../components/Customers/ModalDelete'

///////INTERFACES///////
interface CustomColumn extends Column<customerItem> {
	sortColumnName?: string
}
///////INTERFACES///////

/////////TYPES//////////
type CustomersManagerProps = {
	customers?: any | undefined
	error?: any | undefined
}
type customerItem = {
	userId: number
	id: number
	lastName: string
	firstName: string
	birthDate: string
	isCompany: any
	phone: string
	postalAdress: string
	canDelete: boolean
}
/////////TYPES//////////

const initialPageSize = 20

const CustomersManager: NextPage<CustomersManagerProps> = (props): JSX.Element | null => {
	const { t } = useTranslation()
	const [customerId, setCustomerId] = useState<number | null>()
	const [searchValue, setSearchValue] = useState<string>()
	const [items, setItems] = useState<Array<customerItem>>([])
	const [tableConfig, setTableConfig] = useState<tableConfigProps | undefined>()
	const [sortingColumn, setSortingColumn] = useState<string>()
	const [currentPaging, setCurrentPaging] = useState<any>({
		fnSendTo: (paging: queryParamPagingProps) => handlePagingCustomersManager(paging),
	})
	const [showModalAdd, setShowModalAdd] = useState<boolean>(false)
	const [showModalDelete, setShowModalDelete] = useState<boolean>(false)
	const actionsErrorManager = bindActionCreators(errorManagerActionCreators, useDispatch())
	const actionsGlobalLoading = bindActionCreators(globalLoadingActionCreators, useDispatch())
	const {
		register: registerPaging,
		handleSubmit: handleSubmitPaging,
		setValue: setValuePaging,
		getValues: getValuesPaging,
	} = useForm({
		defaultValues: {
			rowPerPage: '20',
			tmpGoTo: '0',
			goToPage: '0',
		},
	})
	const [pagingConfig, setConfigPaging] = useState<any>()

	///////////////////////////////// CONFIG ///////////////////////////////////////

	const rowActionsConfig = {
		actionsList: [
			{
				name: 'Modifier',
				clickAction: (row: customerItem) => {
					setCustomerId(row.id)
					setShowModalAdd(true)
				},
				isVisible: () => true,
				disabled: () => false,
			},
			{
				name: 'Supprimer',
				clickAction: (row: customerItem) => {
					setCustomerId(row.id)
					setShowModalDelete(true)
				},
				isVisible: (row: customerItem) => row.canDelete,
				disabled: (row: customerItem) => !row.canDelete,
				testIdKey: 'delete-user',
			},
		],
		requiredRight: null,
	}

	const columns: CustomColumn[] = [
		{
			key: 'lastName',
			name: 'Nom',
			sortable: true,
			sortColumnName: 'lastName',
		},
		{
			key: 'firstName',
			name: 'Prénom',
			sortable: true,
			sortColumnName: 'firstName',
		},
		{
			key: 'email',
			name: 'Adresse email',
			sortable: true,
			sortColumnName: 'email',
		},
		{
			key: 'phone',
			name: 'Téléphone',
			sortable: true,
			sortColumnName: 'phone',
		},
		{
			key: 'postalAdress',
			name: 'Adresse postale',
			sortable: true,
			sortColumnName: 'postalAdress',
		},
		{
			key: 'isCompany',
			name: 'Type du client',
			sortColumnName: 'isCompany',
			sortable: true,
			formatter: (props) => <div>{props.row.isCompany ? 'Professionnel' : 'Particulier'}</div>,
		},
		{
			key: 'Actions',
			name: 'Actions',
			frozen: true,
			formatter: (props) => (
				<div>
					<ActionsTable row={props.row} rowActionsConfig={rowActionsConfig} />
				</div>
			),
		},
	]

	///////////////////////////////// HANDLE ///////////////////////////////////////

	// Used to sort our list, client side
	type Comparator = (a: customerItem, b: customerItem) => number
	function getComparator(sortColumn: string): Comparator {
		switch (sortColumn) {
			case 'lastName':
			case 'firstName':
			case 'email':
			case 'phone':
			case 'postalAdress':
				return (a, b) => {
					return a[sortColumn].localeCompare(b[sortColumn])
				}
			case 'isCompany':
				return (a, b) => {
					return a[sortColumn] === b[sortColumn] ? 0 : a[sortColumn] ? 1 : -1
				}
			case 'userId':
				return (a, b) => {
					return a[sortColumn] - b[sortColumn]
				}
			default:
				throw new Error(`unsupported sortColumn: "${sortColumn}"`)
		}
	}

	const fetchPostAllCustomers = async (page = 0, size = initialPageSize, sort = '', contentOnly = false, search: string): Promise<any> => {
		const token = Store.get('user')
		const customers = await API_TOKEN(token.authenticationToken)
			.post(R.POST_ALL_CUSTOMERS({ page: `${page}`, size: `${size}`, sort: sort }), { searchValue: search } /*, filtersCP*/)
			.then((res) => res.data)
			.catch((e) => {
				return { error: true, message: JSON.stringify(e) }
			})
		if (!customers.error) {
			return contentOnly && !isUndefined(customers.headerContent.contentPagined) ? customers.headerContent.contentPagined : customers
		}
	}

	const handleSubmit = (sortingColumn = '', search = ''): void => {
		actionsGlobalLoading.startLoading()
		const a = async (): Promise<void> => {
			const rst = await fetchPostAllCustomers(0, currentPaging.size, sortingColumn, false, search)
			if (rst.error) {
				actionsErrorManager.createError(rst.response)
			} else {
				setItems(rst.headerContent.contentPaginated.content)
				setCurrentPaging({
					totalElements: rst.headerContent.contentPaginated.totalElements,
					totalPages: rst.headerContent.contentPaginated.totalPages,
					fnSendTo: (paging: queryParamPagingProps) => handlePagingCustomersManager(paging),
				})
			}
			actionsGlobalLoading.endLoading()
		}
		a()
	}

	const handlePagingCustomersManager = (paging: queryParamPagingProps): void => {
		actionsGlobalLoading.startLoading()
		const a = async (): Promise<void> => {
			const rst = await fetchPostAllCustomers(parseInt(paging.page), parseInt(paging.size))
			setItems(rst.headerContent.contentPaginated.content)
			actionsGlobalLoading.endLoading()
		}
		a()
	}

	const handleSearchEnter = (e: any, val: string): void => {
		if (e.keyCode !== 13) return
		setSearchValue(val)
		handleSubmit('', e.target.value)
	}

	const handleClickSearch = (refInput: MutableRefObject<any>): void => {
		setSearchValue(refInput.current.value)
		handleSubmit('', refInput.current.value)
	}

	const handleOpenModal = () => {
		setCustomerId(null)
		setShowModalAdd(true)
	}

	/////////////////////////////// USE EFFECT /////////////////////////////////////

	useEffect(() => {
		if (!showModalAdd && !showModalDelete) handleSubmit('')
	}, [showModalAdd, showModalDelete])

	useEffect(() => {
		if (props.error) {
			actionsErrorManager.createError(props.error.response)
		} else {
			setItems(props.customers.headerContent.contentPaginated.content)
			setTableConfig({
				getComparator: getComparator,
				searchBarComponent: {
					handleSearchEnter: handleSearchEnter,
					handleClickSearch: handleClickSearch,
					placeholder: t('common:common_text_filter_search'),
					defaultValue: searchValue,
					handleReset: (refInput: MutableRefObject<any>) => {
						refInput.current.value = ''
						setSearchValue('')
					},
					setSearchValue: setSearchValue,
				},
				tableTitle: t('common:menu_customers').toString(),
				actionsConfig: {
					label: 'Ajouter un client',
					onClick: handleOpenModal,
				},
			})
			setCurrentPaging({
				totalElements: props.customers.headerContent.contentPaginated.totalElements,
				totalPages: props.customers.headerContent.contentPaginated.totalPages,
				fnSendTo: (paging: queryParamPagingProps) => handlePagingCustomersManager(paging),
			})
			setConfigPaging({
				register: registerPaging,
				handleSubmit: handleSubmitPaging,
				setValue: setValuePaging,
				getValues: getValuesPaging,
			})
			//}
		}
	}, [props])

	useEffect(() => {
		const cpg = cloneDeep(currentPaging)
		if (isUndefined(cpg.totalElements) && !isUndefined(props)) {
			cpg.totalElements = props.customers.headerContent.contentPaginated.totalElements
			cpg.totalPages = props.customers.headerContent.contentPaginated.totalPages
		}
		cpg.fnSendTo = (paging: queryParamPagingProps) => handlePagingCustomersManager(paging)
		setCurrentPaging(cpg)
		handleSubmit('')
	}, [props])

	///////////////////////////////// RENDER ///////////////////////////////////////

	return (
		<>
			<ModalDelete showModal={showModalDelete} closeModalHandler={() => setShowModalDelete(false)} id={customerId} />
			<ModalAdd showModal={showModalAdd} closeModalHandler={() => setShowModalAdd(false)} id={customerId} />
			{props && !isUndefined(tableConfig) && currentPaging ? (
				<TableHandler
					createRows={items}
					cols={columns}
					config={tableConfig}
					pagingConfig={pagingConfig}
					paging={currentPaging}
					sortSetter={setSortingColumn}
				></TableHandler>
			) : null}
		</>
	)
}

export async function getServerSideProps(ctx: {
	req?: { headers: { cookie?: string | undefined } } | undefined
}): Promise<{ props: CustomersManagerProps }> {
	const cookie = cookies(ctx)

	if (!isUndefined(cookie.user)) {
		// cookie.user is considered as string, even if it is object ?
		// So we "cast" it as string
		const a = JSON.stringify(cookie.user)
		// And then parse it to make sure it is an exploitable object
		const token = JSON.parse(a)
		const customers = await API_TOKEN(token.authenticationToken)
			.post(
				R.POST_ALL_CUSTOMERS({ page: '0', size: `${initialPageSize}` }) /*{
				withFilters: false,
				searchField: null,
				searchFieldUpdate: false,
				filtersSelection: null,
			}*/
			)
			.then((res) => res.data)
			.catch((e) => {
				//console.log(e)
				if (!isUndefined(e.response?.data)) {
					return { error: true, response: e.response.data }
				} else {
					return { error: true, response: e.code }
				}
			})
		if (customers.error) {
			return { props: { error: customers.response } }
		} else {
			return { props: { customers: { ...customers } } }
		}
	} else {
		// TODO : If token expired, implement a redirect ?
		return { props: { error: 'NO TOKEN' } }
	}
}

export default CustomersManager
