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
import ModalDelete from '../../components/Projects/ModalDelete'
import ModalAdd, { referentialStatusProject } from '../../components/Projects/ModalAdd'
import ActionsTable from '../../components/ActionsTable'
import theme from '../../theme/theme'
import styled from 'styled-components'

export const ItemStatus = styled.div`
	width: 16px;
	height: 16px;
	border-radius: 16px;
	margin-right: 8px;
	background-color: ${(props: any) =>
		props.statusId == 0 || props.statusId == 5
			? theme.colors.border.grey
			: props.statusId == 1
			? theme.colors.warning
			: props.statusId == 2 || props.statusId == 3
			? theme.colors.success_200
			: theme.colors.danger_200};
`

///////INTERFACES///////
interface CustomColumn extends Column<userItem> {
	sortColumnName?: string
}
///////INTERFACES///////

/////////TYPES//////////
type ProjetcsManagerProps = {
	Projetcs?: any | undefined
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

const ProjetcsManager: NextPage<ProjetcsManagerProps> = (props): JSX.Element | null => {
	const { t } = useTranslation()
	// Search bar
	const [searchValue, setSearchValue] = useState<string>()
	// Table
	const [items, setItems] = useState<Array<userItem>>([])
	const [tableConfig, setTableConfig] = useState<tableConfigProps | undefined>()
	const [sortingColumn, setSortingColumn] = useState<string>()
	const [currentPaging, setCurrentPaging] = useState<any>({
		fnSendTo: (paging: queryParamPagingProps) => handlePagingProjetcsManager(paging),
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
	const [showModalDelete, setShowModalDelete] = useState<boolean>(false)
	const [projectId, setProjectId] = useState<number | null>(null)
	const [customerId, setCustomerId] = useState<number | null>(null)

	///////////////////////////////// CONFIG ///////////////////////////////////////
	const rowActionsConfig = {
		actionsList: [
			{
				name: 'Modifier',
				clickAction: (row: userItem) => {
					setProjectId(row.id)
					setCustomerId(row.customerId)
					setShowModal(true)
				},
				isVisible: () => true,
				disabled: () => false,
			},
			{
				name: 'Supprimer',
				clickAction: (row: userItem) => {
					setProjectId(row.id)
					setCustomerId(row.customerId)
					setShowModalDelete(true)
				},
				isVisible: (row) => row.canDelete,
				disabled: () => false,
				testIdKey: 'delete-user',
			},
		],
		requiredRight: null,
	}

	const columns: CustomColumn[] = [
		{
			key: 'name',
			name: 'Nom du projet',
			sortable: true,
			sortColumnName: 'name',
		},
		{
			key: 'statusId',
			name: 'Statut',
			sortable: true,
			sortColumnName: 'statusId',
			formatter: (props) => (
				<div style={{ display: 'flex', alignItems: 'center', flexDirection: 'row' }}>
					<ItemStatus statusId={props.row.statusId} />
					{referentialStatusProject[props.row.statusId]}
				</div>
			),
		},
		{
			key: 'Actions',
			name: 'Actions',
			frozen: true,
			formatter: (props) => <ActionsTable row={props.row} rowActionsConfig={rowActionsConfig} />,
		},
	]

	///////////////////////////////// HANDLE ///////////////////////////////////////

	// Used to sort our list, client side
	type Comparator = (a: userItem, b: userItem) => number
	function getComparator(sortColumn: string): Comparator {
		switch (sortColumn) {
			case 'name':
				return (a, b) => {
					return a[sortColumn].localeCompare(b[sortColumn])
				}
			case 'statusId':
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

	const fetchPostAllProjetcs = async (page = 0, size = initialPageSize, sort = '', contentOnly = false, search: string): Promise<any> => {
		const token = Store.get('user')
		const Projetcs = await API_TOKEN(token.authenticationToken)
			.post(R.POST_ALL_PROJECTS({ page: `${page}`, size: `${size}`, sort: sort }), { searchValue: search } /*, filtersCP*/)
			.then((res) => res.data)
			.catch((e) => {
				return { error: true, message: JSON.stringify(e) }
			})
		if (!Projetcs.error) {
			return contentOnly && !isUndefined(Projetcs.headerContent.contentPagined) ? Projetcs.headerContent.contentPagined : Projetcs
		}
	}

	const handleSubmit = (sortingColumn = '', search: string): void => {
		actionsGlobalLoading.startLoading()
		const a = async (): Promise<void> => {
			const rst = await fetchPostAllProjetcs(0, currentPaging.size, sortingColumn, false, search)
			if (rst.error) {
				actionsErrorManager.createError(rst.response)
			} else {
				setItems(rst.headerContent.contentPaginated.content)
				setCurrentPaging({
					totalElements: rst.headerContent.contentPaginated.totalElements,
					totalPages: rst.headerContent.contentPaginated.totalPages,
					fnSendTo: (paging: queryParamPagingProps) => handlePagingProjetcsManager(paging),
				})
			}
			actionsGlobalLoading.endLoading()
		}
		a()
	}

	const handlePagingProjetcsManager = (paging: queryParamPagingProps): void => {
		actionsGlobalLoading.startLoading()
		const a = async (): Promise<void> => {
			const rst = await fetchPostAllProjetcs(parseInt(paging.page), parseInt(paging.size))
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
		setProjectId(null)
		setCustomerId(null)
		setShowModal(true)
	}

	/////////////////////////////// USE EFFECT /////////////////////////////////////

	useEffect(() => {
		if (!showModal && !showModalDelete) handleSubmit('')
	}, [showModal, showModalDelete])

	useEffect(() => {
		if (props.error) {
			actionsErrorManager.createError(props.error.response)
		} else {
			setItems(props.headerContent.contentPaginated.content)
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
				tableTitle: t('common:menu_projects').toString(),
				actionsConfig: {
					label: 'Ajouter un projet',
					onClick: handleOpenModal,
				},
			})
			setCurrentPaging({
				totalElements: props.headerContent.contentPaginated.totalElements,
				totalPages: props.headerContent.contentPaginated.totalPages,
				fnSendTo: (paging: queryParamPagingProps) => handlePagingProjetcsManager(paging),
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
			cpg.totalElements = props.headerContent.contentPaginated.totalElements
			cpg.totalPages = props.headerContent.contentPaginated.totalPages
		}
		cpg.fnSendTo = (paging: queryParamPagingProps) => handlePagingProjetcsManager(paging)
		setCurrentPaging(cpg)
		handleSubmit()
	}, [props])

	///////////////////////////////// RENDER ///////////////////////////////////////

	return (
		<>
			<ModalDelete showModal={showModalDelete} closeModalHandler={() => setShowModalDelete(false)} id={projectId} customerId={customerId} />
			<ModalAdd showModal={showModal} closeModalHandler={() => setShowModal(false)} id={projectId} />
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
}): Promise<{ props: ProjetcsManagerProps }> {
	const cookie = cookies(ctx)

	if (!isUndefined(cookie.user)) {
		const a = JSON.stringify(cookie.user)
		const token = JSON.parse(a)
		const Projetcs = await API_TOKEN(token.authenticationToken)
			.post(R.POST_ALL_PROJECTS({ page: '0', size: `${initialPageSize}` }))
			.then((res) => res.data)
			.catch((e) => {
				//console.log(e)
				if (!isUndefined(e.response?.data)) {
					return { error: true, response: e.response.data }
				} else {
					return { error: true, response: e.code }
				}
			})
		if (Projetcs.error) {
			return { props: { error: Projetcs.response } }
		} else {
			return { props: { ...Projetcs } }
		}
	} else {
		return { props: { error: 'NO TOKEN' } }
	}
}

export default ProjetcsManager
