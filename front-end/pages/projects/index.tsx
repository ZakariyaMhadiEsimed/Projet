/* eslint-disable react-hooks/exhaustive-deps */
////////LIBRARY/////////
import { cloneDeep, cloneDeepWith, isEqual, isUndefined } from 'lodash'
import { NextPage } from 'next'
import cookies from 'next-cookies'
import { useRouter } from 'next/router'
import { MutableRefObject, useEffect, useState } from 'react'
import { Column } from 'react-data-grid'
import { useTranslation } from 'react-i18next'
import { useDispatch, shallowEqual, useSelector } from 'react-redux'
import { bindActionCreators } from 'redux'
///////COMPONENTS///////
import ActionsTable from '../../components/ActionsTable'
import Modals from '../../components/Modals'
import PageActions from '../../components/PageActions'
import { PageActionsButtonLink } from '../../components/PageActions/PageActions'
import { queryParamPagingProps } from '../../components/Paging/Paging'
import TableHandler from '../../components/TableHandler'
import API_TOKEN from '../../config/AxiosConfig'
import * as R from '../../constants/Endpoint'
import { uriList } from '../../constants/RouteList'
import allReplace from '../../helpers/allReplace'
import Store from '../../helpers/Store'
import StringFormatter from '../../helpers/StringFormatter'
import UseCheckAll from '../../hooks/UseCheckAll'
import { HeaderFilters } from '../../interfaces/components/PageActions/PageActions.interfaces'
import { tableConfigProps } from '../../interfaces/components/TableHandler/TableHandler.interfaces'
import { errorManagerActionCreators, globalLoadingActionCreators, toastSuccessActionCreators } from '../../store/actions'
import { Button, ButtonWrapper, ModalsBodyContainer } from '../../theme/GlobalCss'
import theme from '../../theme/theme'
import { userPrivileges } from '../../constants/PrivilegesList'
import { RootState } from '../../interfaces/store/store.interfaces'

///////INTERFACES///////
interface CustomColumn extends Column<userItem> {
	sortColumnName?: string
}
///////INTERFACES///////

/////////TYPES//////////
type usersManagerProps = {
	users?: any | undefined
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

// TODO : Used for skeleton process, might be removed
// Pagination size
// We need to make sure that scrollbar is showing when we have more elements than those direcly visible in layout
const initialPageSize = 250
//const padPageSize = 5
//const startPaging = 10 // Should be initialPageSize / padPageSize

const UsersManager: NextPage<usersManagerProps> = (props): JSX.Element | null => {
	const { privileges } = useSelector(
		(state: RootState) => ({
			privileges: state.user.identity.privileges,
		}),
		shallowEqual
	)
	const { t } = useTranslation()
	const router = useRouter()
	const [prevFilters, setPrevFilters] = useState<HeaderFilters | undefined>() // Previous filters (for 'updated' var check on UseCheckAll)
	const [filters, setFilters, handleCheckElements] = UseCheckAll(prevFilters, undefined) // Our current filters
	const [defaultFilters, setDefaultFilters] = useState<HeaderFilters | undefined>() // Default filters (for refresh)
	// Modals
	const [modalRow, setModalRow] = useState<userItem>()
	const [showDeactivateModal, setShowDeactivateModal] = useState<boolean>(false)
	// Search bar
	const [searchValue, setSearchValue] = useState<string>()
	// Table
	const [items, setItems] = useState<Array<userItem>>([])
	const [tableConfig, setTableConfig] = useState<tableConfigProps | undefined>()
	const [sortingColumn, setSortingColumn] = useState<string>()
	const [currentPaging, setCurrentPaging] = useState<any>({
		fnSendTo: (paging: queryParamPagingProps) => handlePagingUsersManager(paging),
	})
	// REDUX actions
	const actionsErrorManager = bindActionCreators(errorManagerActionCreators, useDispatch())
	const actionsGlobalLoading = bindActionCreators(globalLoadingActionCreators, useDispatch())
	const actionsToastSuccess = bindActionCreators(toastSuccessActionCreators, useDispatch())

	///////////////////////////////// CONFIG ///////////////////////////////////////

	const rowActionsConfig = {
		actionsList: [
			{
				name: t('users:page_users_table_column_actions_editUser'),
				clickAction: (row: userItem) => router.push(`${uriList.users}${uriList.usersEdit}/${row.userId}`),
				isVisible: (row: userItem) => !isUndefined(privileges.find((privilege: any) => privilege == userPrivileges.USERS_MANAGE_ACTION_LIST)),
				disabled: (row: userItem) => !row.enabled,
			},
			{
				name: t('users:page_users_table_column_actions_deleteUser'),
				clickAction: (row: userItem) => handleModalDectivate(row),
				isVisible: (row: userItem) => !isUndefined(privileges.find((privilege: any) => privilege == userPrivileges.USERS_MANAGE_ACTION_LIST)),
				disabled: (row: userItem) => !row.enabled,
				redFlag: true,
				testIdKey: 'delete-user',
			},
		],
		requiredRight: null,
	}

	const columns: CustomColumn[] = [
		{
			key: 'username',
			name: t('users:page_users_table_column_username').toString(),
			sortable: true,
			sortColumnName: 'username',
		},
		{
			key: 'lastName',
			name: t('users:page_users_table_column_lastName').toString(),
			sortable: true,
			sortColumnName: 'lastName',
		},
		{
			key: 'firstName',
			name: t('users:page_users_table_column_firstName').toString(),
			sortable: true,
			sortColumnName: 'firstName',
		},
		{
			key: 'sectorName',
			name: t('users:page_users_table_column_sectorName').toString(),
			sortable: true,
			sortColumnName: 'sector.name',
		},
		{
			key: 'roleName',
			name: t('users:page_users_table_column_roleName').toString(),
			sortable: true,
			sortColumnName: 'role.sortOrder',
			formatter: (props) => t(`users:page_users_table_row_roleName_${props.row.roleName}`),
		},
		{
			key: 'enabledLabel',
			name: t('users:page_users_table_column_enabledLabel').toString(),
			sortable: true,
			sortColumnName: 'isEnabled',
			formatter: (props) => t(`users:page_users_table_row_enabledLabel_${props.row.enabledLabel}`),
		},
		{
			key: 'Actions',
			name: 'Actions',
			frozen: true,
			formatter: (props) =>
				!isUndefined(privileges.find((privilege: any) => privilege == userPrivileges.USERS_MANAGE_ACTION_LIST)) && (
					<ActionsTable row={props.row} rowActionsConfig={rowActionsConfig} />
				),
		},
	]

	///////////////////////////////// HANDLE ///////////////////////////////////////

	// Used to sort our list, client side
	type Comparator = (a: userItem, b: userItem) => number
	function getComparator(sortColumn: string): Comparator {
		switch (sortColumn) {
			case 'username':
			case 'lastName':
			case 'firstName':
			case 'sectorName':
			case 'roleName':
			case 'enabledLabel':
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

	const fetchDataUsers = async (page = 0, size = initialPageSize, sort = '', contentOnly = false, resetScroll = false): Promise<any> => {
		const filtersCP = cloneDeep(filters)
		if (!isEqual(filtersCP, {})) filtersCP.withFilters = true
		const token = Store.get('user')
		const users = await API_TOKEN(token.authenticationToken)
			.post(R.GET_USERS({ page: `${page}`, size: `${size}`, sort: sort }), filtersCP)
			.then((res) => res.data)
			.catch((e) => {
				return { error: true, message: JSON.stringify(e) }
			})
		if (!users.error) {
			return contentOnly && !isUndefined(users.headerContent.contentPagined) ? users.headerContent.contentPagined : users
		}
	}

	const fetchDataUserDelete = async (userId: userItem['userId']): Promise<any> => {
		const token = Store.get('user')
		const userDelete = await API_TOKEN(token.authenticationToken)
			.put(R.DEACTIVATE_USER(userId))
			.then((res) => res.data)
			.catch((e) => {
				return { error: true, message: JSON.stringify(e) }
			})
		if (!userDelete.error) {
			actionsToastSuccess.hydrateToast(t('users:page_users_toast_deletedUser'))
			handleCloseModals()
			handlePageRefresh()
			//setUpdated(true)
		} else {
			actionsErrorManager.createError(userDelete.response)
		}
		actionsGlobalLoading.endLoading()
	}

	const handleModalDectivate = (row: any): void => {
		setShowDeactivateModal(true)
		setModalRow(row)
	}

	const handleCloseModals = (): void => {
		if (showDeactivateModal) {
			setShowDeactivateModal(false)
		}
		setModalRow(undefined)
	}

	const handleDeactivateUser = (userId: userItem['userId'] | undefined): void => {
		if (!isUndefined(userId)) {
			actionsGlobalLoading.startLoading()
			fetchDataUserDelete(userId)
		}
	}

	const handlePageRefresh = (): void => {
		setItems([])
		actionsGlobalLoading.startLoading()
		const a = async (): Promise<void> => {
			const rst = await fetchDataUsers(0, currentPaging?.size)
			setItems(rst.headerContent.contentPaginated.content)
			setPrevFilters(rst.headerParam.filters)
			setFilters(rst.headerParam.filters)
			setCurrentPaging({
				totalElements: rst.headerContent.contentPaginated.totalElements,
				totalPages: rst.headerContent.contentPaginated.totalPages,
				fnSendTo: (paging: queryParamPagingProps) => handlePagingUsersManager(paging),
			})
			actionsGlobalLoading.endLoading()
		}
		a()
	}

	const handleSubmit = (sortingColumn = ''): void => {
		if (isEqual(filters, prevFilters) && sortingColumn === '') return // guard to call if no change
		setPrevFilters(filters)
		actionsGlobalLoading.startLoading()
		const a = async (): Promise<void> => {
			const rst = await fetchDataUsers(0, currentPaging.size, sortingColumn, false, true)
			if (rst.error) {
				actionsErrorManager.createError(rst.response)
			} else {
				setItems(rst.headerContent.contentPaginated.content)
				setPrevFilters(rst.headerParam.filters)
				setFilters(rst.headerParam.filters)
				setCurrentPaging({
					totalElements: rst.headerContent.contentPaginated.totalElements,
					totalPages: rst.headerContent.contentPaginated.totalPages,
					fnSendTo: (paging: queryParamPagingProps) => handlePagingUsersManager(paging),
				})
			}
			actionsGlobalLoading.endLoading()
		}
		a()
	}

	const handlePagingUsersManager = (paging: queryParamPagingProps): void => {
		actionsGlobalLoading.startLoading()
		const a = async (): Promise<void> => {
			const rst = await fetchDataUsers(parseInt(paging.page), parseInt(paging.size))
			setItems(rst.headerContent.contentPaginated.content)
			setPrevFilters(rst.headerParam.filters)
			setFilters(rst.headerParam.filters)
			setCurrentPaging(paging)
			actionsGlobalLoading.endLoading()
		}
		a()
	}

	const handleSearchEnter = (e: any, val: string): void => {
		if (e.keyCode !== 13) return
		setSearchValue(val)
		//actionsColumns.setIsSearchfieldUpdated(true)
	}

	const handleClickSearch = (refInput: MutableRefObject<any>): void => {
		setSearchValue(refInput.current.value)
		//actionsColumns.setIsSearchfieldUpdated(true)
	}

	const pageActionsConfig = {
		filtersConfig: {
			defaultFilters: defaultFilters,
			useCheckAll: {
				setPrevFilters: setPrevFilters,
				setFilters: setFilters,
				handleCheckElements: handleCheckElements,
			},
			filtersTranslationKeys: {
				sectors: { title: 'users:page_users_filters_sector_title' },
				roles: { title: 'users:page_users_filters_role_title', toTranslate: true, prefixTranslation: 'users:page_users_filters_roles_item_' },
				status: {
					title: 'users:page_users_filters_status_title',
					toTranslate: true,
					prefixTranslation: 'users:page_users_filters_status_item_',
				},
			},
			handleSubmit: handleSubmit,
		},
		pageActions: [
			() =>
				!isUndefined(privileges.find((privilege: any) => privilege == userPrivileges.USERS_MANAGE_ACTION_LIST)) && (
					<PageActionsButtonLink href={`${uriList.users}${uriList.usersCreate}`}>
						{t('users:page_users_button_usersCreate')}
					</PageActionsButtonLink>
				),
		],
	}

	/////////////////////////////// USE EFFECT /////////////////////////////////////

	// Search bar useEffects
	useEffect(() => {
		const filtersCP = cloneDeepWith(filters)
		if (!isUndefined(filtersCP)) {
			filtersCP.searchField = searchValue
		}
		const cfg = cloneDeep(tableConfig)
		if (!isUndefined(cfg)) {
			cfg.searchBarComponent = {
				handleSearchEnter: handleSearchEnter,
				handleClickSearch: handleClickSearch,
				placeholder: t('common:common_text_filter_search'),
				defaultValue: searchValue,
				handleReset: (refInput) => {
					refInput.current.value = ''
					setSearchValue('')
				},
			}
		}
		setTableConfig(cfg)
		setFilters(filtersCP)
	}, [searchValue])

	useEffect(() => {
		if (isUndefined(filters) || filters?.searchField !== searchValue) return
		handleSubmit()
	}, [filters?.searchField])

	/*useEffect(() => {
		if (props.error) {
			actionsErrorManager.createError(props.error.response)
		} else {
			setItems(props.users.headerContent.contentPaginated.content)
			// Setting filters
			setFilters(props.users.headerParam.filters)
			setPrevFilters(props.users.headerParam.filters)
			// Also setting default filters (for refresh button)
			setDefaultFilters(props.users.headerParam.filters)
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
				tableTitle: t('users:page_users_table_title').toString(),
			})
			//if (isEqual(filters, prevFilters)) {
			setCurrentPaging({
				totalElements: props.users.headerContent.contentPaginated.totalElements,
				totalPages: props.users.headerContent.contentPaginated.totalPages,
				fnSendTo: (paging: queryParamPagingProps) => handlePagingUsersManager(paging),
			})
			//}
		}
	}, [props])*/

	useEffect(() => {
		const cpg = cloneDeep(currentPaging)
		if (isUndefined(cpg.totalElements) && !isUndefined(props.users)) {
			cpg.totalElements = props.users.headerContent.contentPaginated.totalElements
			cpg.totalPages = props.users.headerContent.contentPaginated.totalPages
		}
		cpg.fnSendTo = (paging: queryParamPagingProps) => handlePagingUsersManager(paging)
		setCurrentPaging(cpg)
		handleSubmit()
	}, [filters, props])

	// When user is changing column sort
	useEffect(() => {
		handleSubmit(sortingColumn)
	}, [sortingColumn])

	///////////////////////////////// RENDER ///////////////////////////////////////

	return (
		<>
			<Modals
				showModal={showDeactivateModal}
				closeModalHandler={handleCloseModals}
				headerTitle={t('users:page_users_modal_deactivate_title').toString()}
				level="error"
			>
				<ModalsBodyContainer hasTitle={true}>
					{!isUndefined(modalRow) && (
						<p
							dangerouslySetInnerHTML={{
								__html: allReplace(
									StringFormatter.ResponseMessageParser(t('users:page_users_modal_deactivate_body'), [
										modalRow?.lastName,
										modalRow?.firstName,
									]),
									'\\\n',
									'<br>'
								),
							}}
						></p>
					)}
				</ModalsBodyContainer>
				<ButtonWrapper>
					<Button
						id="SubmitButtonUserDeactivateModalCancel"
						type="button"
						color={theme.colors.dark_100}
						backgroundColor={theme.colors.white}
						hoverBackgroundColor={theme.colors.light_400}
						//percentUnit={false}
						//fontSize={theme.text.fontSize.fm}
						value={t('common:common_text_error_canceled').toString()}
						onClick={() => handleCloseModals()}
					/>
					<Button
						id="SubmitButtonUserDeactivateModalValidate"
						type="submit"
						backgroundColor={theme.colors.danger}
						color={theme.colors.white}
						hoverBackgroundColor={theme.colors.danger_200}
						data-testid="submit-button-deactivate-user"
						//percentUnit={false}
						//fontSize={theme.text.fontSize.fm}
						value={t('common:common_text_ok').toString()}
						onClick={() => handleDeactivateUser(modalRow?.userId)}
					/>
				</ButtonWrapper>
			</Modals>
			{!isUndefined(filters) && <PageActions pageActionsConfig={pageActionsConfig} filtersState={filters} />}
			{props.users && !isUndefined(tableConfig) ? (
				<TableHandler
					createRows={items}
					cols={columns}
					config={tableConfig}
					paging={currentPaging}
					sortSetter={setSortingColumn}
				></TableHandler>
			) : null}
		</>
	)
}

/*export async function getServerSideProps(ctx: {
	req?: { headers: { cookie?: string | undefined } } | undefined
}): Promise<{ props: usersManagerProps }> {
		const cookie = cookies(ctx)

	if (!isUndefined(cookie.user)) {
		// cookie.user is considered as string, even if it is object ?
		// So we "cast" it as string
		const a = JSON.stringify(cookie.user)
		// And then parse it to make sure it is an exploitable object
		const token = JSON.parse(a)
		const users = await API_TOKEN(token.authenticationToken)
			.post(R.GET_USERS({ page: '0', size: `${initialPageSize}` }), {
				withFilters: false,
				searchField: null,
				searchFieldUpdate: false,
				filtersSelection: null,
			})
			.then((res) => res.data)
			.catch((e) => {
				//console.log(e)
				if (!isUndefined(e.response?.data)) {
					return { error: true, response: e.response.data }
				} else {
					return { error: true, response: e.code }
				}
			})
		if (users.error) {
			return { props: { error: users.response } }
		} else {
			return { props: { users } }
		}
	} else {
		// TODO : If token expired, implement a redirect ?
		return { props: { error: 'NO TOKEN' } }

}}*/

export default UsersManager
