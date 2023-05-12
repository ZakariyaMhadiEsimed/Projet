////////LIBRARY/////////
import { useEffect, useState } from 'react'
import i18n from 'i18next'
import moment from 'moment'
import { useDispatch, useSelector, shallowEqual } from 'react-redux'
import { bindActionCreators } from 'redux'
///////COMPONENTS///////
import Layout from '../components/Layout'
import Store from '../helpers/Store'
import Base64Format from '../helpers/Base64Format'
import { find, isUndefined } from 'lodash'
import * as R from '../constants/Endpoint'
import { API } from '../config/AxiosConfig'
import { Router } from 'next/router'
import Login from '../pages/login'
import { RootState } from '../interfaces/store/store.interfaces'
import { routeList, RouteObject, uriList } from '../constants/RouteList'
import { globalLoadingActionCreators, loginActionCreators } from '../store/actions'

/////////TYPES//////////
type ProtectedRouteType = {
	router: Router
	children: any
}
/////////TYPES//////////

const ProtectedRoute = ({ router, children }: ProtectedRouteType): any => {
	const { user } = useSelector(
		(state: RootState) => ({
			user: state.user,
		}),
		shallowEqual
	)

	const [isBrowser, setIsBrowser] = useState(false)
	const [constructorFlag, setConstructorFlag] = useState(true)
	const actionsGlobalLoading = bindActionCreators(globalLoadingActionCreators, useDispatch())
	const [routeObject, setRouteObject] = useState<RouteObject>()
	//return children
	const actionsLogin = bindActionCreators(loginActionCreators, useDispatch())

	/////////////////////////////// USE EFFECT /////////////////////////////////////

	useEffect(() => {
		if (isBrowser) {
			const userLocalStorage = Store.get('user')
			const preferences = Store.get('preferences')
			if (preferences && !isUndefined(preferences.idLanguage) && i18n.resolvedLanguage !== preferences.idLanguage) {
				i18n.changeLanguage(preferences.idLanguage)
			}
			if (userLocalStorage && !isUndefined(userLocalStorage.authenticationToken)) {
				const token = Base64Format.splitToken(userLocalStorage.authenticationToken)
				const timeNow = moment().unix()
				const exp = token.body.exp - token.body.iat

				if (timeNow < token.body.exp) {
					actionsLogin.getCurrentUser(userLocalStorage.authenticationToken)
					setTimeout(actionsLogin.getLogout, exp * 1000)
				} else {
					actionsLogin.getLogout('user')
					router.push(uriList.login)
				}
			} else {
				actionsLogin.getLogout('user')
				router.push(uriList.login)
			}
			setConstructorFlag(false)
		}
	}, [isBrowser])

	// Waiting that client is loaded
	useEffect(() => {
		if (typeof window !== 'undefined') setIsBrowser(true)
	}, [])

	// Implementing redirections (by toast for example)
	useEffect(() => {
		if (user?.path?.length > 0) {
			router.push(user.path)
		}
	}, [user.path, router])

	useEffect(() => {
		const f = find(routeList, { path: router.pathname })
		if (!isUndefined(f)) {
			setRouteObject(f)
		}
	}, [router.asPath])

	// Checking rights
	// TODO : Waiting back-end to implement this
	useEffect(() => {
		if (!isUndefined(routeObject) && !isUndefined(user.identity.privileges) && !isUndefined(routeObject.requiredPrivilege)) {
			if (isUndefined(find(user.identity.privileges, (o) => o === routeObject.requiredPrivilege))) {
				actionsLogin.getLogout('user')
				router.push(uriList.login)
			}
		}
	}, [routeObject, user])

	// Anythime children is changing, closing loader
	useEffect(() => {
		actionsGlobalLoading.endLoading()
	}, [children])

	///////////////////////////////// RENDER ///////////////////////////////////////

	return !constructorFlag ? (
		router.route === uriList.maintenance ? (
			children
		) : user.isLoading ? null : user.isConnected ? (
			<Layout routerParams={routeObject}>{children}</Layout>
		) : (
			<Login />
		)
	) : null
}
export default ProtectedRoute
