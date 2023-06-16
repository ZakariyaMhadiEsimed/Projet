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

const UsersManager: NextPage<any> = (props): JSX.Element | null => {
	const { t } = useTranslation()
	const router = useRouter()

	// REDUX actions
	const actionsErrorManager = bindActionCreators(errorManagerActionCreators, useDispatch())
	const actionsGlobalLoading = bindActionCreators(globalLoadingActionCreators, useDispatch())
	const actionsToastSuccess = bindActionCreators(toastSuccessActionCreators, useDispatch())

	///////////////////////////////// CONFIG ///////////////////////////////////////

	///////////////////////////////// HANDLE ///////////////////////////////////////

	/////////////////////////////// USE EFFECT /////////////////////////////////////

	///////////////////////////////// RENDER ///////////////////////////////////////

	return <div style={{ backgroundColor: theme.colors.white, flex: '0 0 100%' }}></div>
}

export default UsersManager
