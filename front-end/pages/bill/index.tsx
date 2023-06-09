/* eslint-disable react-hooks/exhaustive-deps */
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
import UseCheckAll from '../../hooks/UseCheckAll'
import { HeaderFilters } from '../../interfaces/components/PageActions/PageActions.interfaces'
import { tableConfigProps } from '../../interfaces/components/TableHandler/TableHandler.interfaces'
import { errorManagerActionCreators, globalLoadingActionCreators } from '../../store/actions'
import { useForm } from 'react-hook-form'
import ModalAdd from '../../components/Bills/ModalAdd'
import ActionsTable from '../../components/ActionsTable'
import { ItemStatus } from '../projects'
import ModalDelete from '../../components/Bills/ModalDelete'

///////INTERFACES///////
interface CustomColumn extends Column<userItem> {
	sortColumnName?: string
}
///////INTERFACES///////

/////////TYPES//////////
const statusSelect = [
	{ label: 'Editée', id: 0 },
	{ label: 'Envoyée', id: 1 },
	{ label: 'Payée', id: 2 },
]
export const referentialStatusBill = ['Editée', 'Envoyée', 'Payée']
type BillsManagerProps = {
	Bills?: any | undefined
	error?: any | undefined
}
type userItem = {
	userId: number
	username: string
	lastName: string
	firstName: string
	sectorName: string
	roleName: string
	enabled: boolean
	enabledLabel: string
}
/////////TYPES//////////

const initialPageSize = 20

const BillsManager: NextPage<BillsManagerProps> = (props): JSX.Element | null => {
	const { t } = useTranslation()
	const [prevFilters, setPrevFilters] = useState<HeaderFilters | undefined>() // Previous filters (for 'updated' var check on UseCheckAll)
	const [filters, setFilters, handleCheckElements] = UseCheckAll(prevFilters, undefined) // Our current filters
	// Search bar
	const [searchValue, setSearchValue] = useState<string>()
	// Table
	const [items, setItems] = useState<Array<userItem>>([])
	const [tableConfig, setTableConfig] = useState<tableConfigProps | undefined>()
	const [sortingColumn, setSortingColumn] = useState<string>()
	const [currentPaging, setCurrentPaging] = useState<any>({
		fnSendTo: (paging: queryParamPagingProps) => handlePagingBillsManager(paging),
	})
	// REDUX actions
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
	const [showModal, setShowModal] = useState<boolean>(false)
	const [billId, setBillId] = useState<number | null>()
	const [showModalDelete, setShowModalDelete] = useState<boolean>(false)
	const [projectId, setProjectId] = useState<boolean>(0)
	///////////////////////////////// CONFIG ///////////////////////////////////////

	const rowActionsConfig = {
		actionsList: [
			{
				name: 'Modifier',
				clickAction: (row: userItem) => {
					setBillId(row.id)
					setShowModal(true)
				},
				isVisible: (row: userItem) => row.statusId == 0,
			},
			{
				name: 'Envoyer',
				clickAction: async (row: userItem) => {
					await fetchSendBill(row.id)
					handleSubmit()
				},
				isVisible: (row: userItem) => row.statusId == 0,
			},
			{
				name: 'Editer',
				clickAction: async (row: userItem) => {
					setBillId(row.id)
					await fetchEditBill(row.id)
					handleSubmit()
					setShowModal(true)
				},
				isVisible: (row: userItem) => row.statusId == 1,
			},
			{
				name: 'Payer',
				clickAction: async (row: userItem) => {
					await fetchPayedBill(row.id)
					handleSubmit()
				},
				isVisible: (row: userItem) => row.statusId == 1,
			},
			{
				name: 'Supprimer',
				clickAction: (row: userItem) => {
					setBillId(row.id)
					setProjectId(row.projectId)
					setShowModalDelete(true)
				},
				isVisible: (row: userItem) => row.statusId == 0,
			},
		],
		requiredRight: null,
	}

	const columns: CustomColumn[] = [
		{
			key: 'number',
			name: 'N° de la facture',
			sortable: true,
			sortColumnName: 'number',
		},
		{
			key: 'paymentDate',
			name: 'Date de paiement',
			sortable: true,
			sortColumnName: 'paymentDate',
		},
		{
			key: 'paymentLimits',
			name: 'Date limite',
			sortable: true,
			sortColumnName: 'paymentLimits',
		},
		{
			key: 'statusId',
			name: 'Statut',
			sortable: true,
			sortColumnName: 'statusId',
			formatter: (props) => (
				<div style={{ display: 'flex', alignItems: 'center', flexDirection: 'row' }}>
					<ItemStatus statusId={props.row.statusId} />
					{referentialStatusBill[props.row.statusId]}
				</div>
			),
		},
		{
			key: 'Actions',
			name: 'Actions',
			frozen: true,
			formatter: (props) => props.row.statusId != 2 && <ActionsTable row={props.row} rowActionsConfig={rowActionsConfig} />,
		},
	]

	///////////////////////////////// HANDLE ///////////////////////////////////////

	// Used to sort our list, client side
	type Comparator = (a: userItem, b: userItem) => number
	function getComparator(sortColumn: string): Comparator {
		switch (sortColumn) {
			case 'number':
			case 'paymentDate':
			case 'paymentLimits':
			case 'statusId':
				return (a, b) => {
					return a[sortColumn].localeCompare(b[sortColumn])
				}
			case 'enabled':
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

	const fetchPostAllBills = async (page = 0, size = initialPageSize, sort = '', contentOnly = false, search: string): Promise<any> => {
		const token = Store.get('user')
		const Bills = await API_TOKEN(token.authenticationToken)
			.post(R.POST_ALL_BILLS({ page: `${page}`, size: `${size}`, sort: sort }), { searchValue: search } /*, filtersCP*/)
			.then((res) => res.data)
			.catch((e) => {
				return { error: true, message: JSON.stringify(e) }
			})
		if (!Bills.error) {
			return contentOnly && !isUndefined(Bills.headerContent.contentPagined) ? Bills.headerContent.contentPagined : Bills
		}
	}

	const fetchSendBill = async (id: number): Promise<any> => {
		const token = Store.get('user')
		await API_TOKEN(token.authenticationToken)
			.get(R.GET_BILL_SEND(id))
			.then((res) => res.data)
			.catch((e) => {
				return { error: true, message: JSON.stringify(e) }
			})
	}
	const fetchEditBill = async (id: number): Promise<any> => {
		const token = Store.get('user')
		await API_TOKEN(token.authenticationToken)
			.get(R.GET_BILL_EDIT(id))
			.then((res) => res.data)
			.catch((e) => {
				return { error: true, message: JSON.stringify(e) }
			})
	}
	const fetchPayedBill = async (id: number): Promise<any> => {
		const token = Store.get('user')
		await API_TOKEN(token.authenticationToken)
			.get(R.GET_BILL_PAYED(id))
			.then((res) => res.data)
			.catch((e) => {
				return { error: true, message: JSON.stringify(e) }
			})
	}

	const handleSubmit = (sortingColumn = '', search: string): void => {
		actionsGlobalLoading.startLoading()
		const a = async (): Promise<void> => {
			const rst = await fetchPostAllBills(0, currentPaging.size, sortingColumn, false, search)
			if (rst.error) {
				actionsErrorManager.createError(rst.response)
			} else {
				setItems(rst.headerContent.contentPaginated.content)
				setCurrentPaging({
					totalElements: rst.headerContent.contentPaginated.totalElements,
					totalPages: rst.headerContent.contentPaginated.totalPages,
					fnSendTo: (paging: queryParamPagingProps) => handlePagingBillsManager(paging),
				})
			}
			actionsGlobalLoading.endLoading()
		}
		a()
	}

	const handlePagingBillsManager = (paging: queryParamPagingProps): void => {
		actionsGlobalLoading.startLoading()
		const a = async (): Promise<void> => {
			const rst = await fetchPostAllBills(parseInt(paging.page), parseInt(paging.size))
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
		console.log('debug click')
		setBillId(null)
		setShowModal(true)
	}
	/////////////////////////////// USE EFFECT /////////////////////////////////////

	useEffect(() => {
		if (props.error) {
			actionsErrorManager.createError(props.error.response)
		} else {
			setItems(props.Bills.headerContent.contentPaginated.content)
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
				tableTitle: t('common:menu_bill').toString(),
				actionsConfig: {
					label: 'Ajouter une facture',
					onClick: handleOpenModal,
				},
			})
			setCurrentPaging({
				totalElements: props.Bills.headerContent.contentPaginated.totalElements,
				totalPages: props.Bills.headerContent.contentPaginated.totalPages,
				fnSendTo: (paging: queryParamPagingProps) => handlePagingBillsManager(paging),
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
		if (!showModal) handleSubmit()
	}, [showModal])

	///////////////////////////////// RENDER ///////////////////////////////////////

	return (
		<>
			<ModalAdd showModal={showModal} closeModalHandler={() => setShowModal(false)} id={billId} />
			<ModalDelete showModal={showModalDelete} closeModalHandler={() => setShowModalDelete(false)} id={billId} projectId={projectId} />
			{props && !isUndefined(tableConfig) && currentPaging ? (
				<>
					<TableHandler
						createRows={items}
						cols={columns}
						config={tableConfig}
						pagingConfig={pagingConfig}
						paging={currentPaging}
						sortSetter={setSortingColumn}
					/>
				</>
			) : null}
		</>
	)
}

export async function getServerSideProps(ctx: {
	req?: { headers: { cookie?: string | undefined } } | undefined
}): Promise<{ props: BillsManagerProps }> {
	const cookie = cookies(ctx)

	if (!isUndefined(cookie.user)) {
		const a = JSON.stringify(cookie.user)
		const token = JSON.parse(a)
		const Bills = await API_TOKEN(token.authenticationToken)
			.post(R.POST_ALL_BILLS({ page: '0', size: `${initialPageSize}` }))
			.then((res) => res.data)
			.catch((e) => {
				//console.log(e)
				if (!isUndefined(e.response?.data)) {
					return { error: true, response: e.response.data }
				} else {
					return { error: true, response: e.code }
				}
			})
		if (Bills.error) {
			return { props: { error: Bills.response } }
		} else {
			return { props: { Bills: Bills } }
		}
	} else {
		return { props: { error: 'NO TOKEN' } }
	}
}

export default BillsManager
