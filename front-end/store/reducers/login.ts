////////LIBRARY/////////
import update from 'immutability-helper'
import { cloneDeep, isEmpty, isUndefined } from 'lodash'
///////COMPONENTS///////
import extendUpdate from '../../helpers/extendUpdate'
import ActionsTypes from '../../constants/ActionsTypes'
import Store from '../../helpers/Store'
import initialState from '../initialState'
import jwtDecode from 'jwt-decode'

extendUpdate(update)

type Jwt = {
	privileges: Array<Number>
	firstName: String
	lastName: String
	roleName: String
	sub: String
	languageId: Number
}

const login = {
	[ActionsTypes.GET_LOGIN]: (state: any): any => {
		return update(state, {
			user: {
				isLoading: {
					$set: true,
				},
			},
		})
	},
	[ActionsTypes.GET_LOGIN_SUCCESS]: (state: any, payload: any): any => {
		const user = payload.user
		const jwt: Jwt = jwtDecode(payload?.user?.authenticationToken)

		Store.set('user', { authenticationToken: user?.authenticationToken })

		const pref = Store.get('preferences')
		if ((!isEmpty(user?.email) && !isEmpty(user?.password)) || (!isUndefined(user?.email) && !isUndefined(user?.password))) {
			pref.email = user?.email
			pref.password = user?.password
			Store.set('preferences', pref)
		}
		return update(state, {
			user: {
				isLoading: {
					$set: false,
				},
				identity: {
					$set: {
						privileges: jwt.privileges,
						firstName: jwt.firstName,
						lastName: jwt.lastName,
						email: jwt.sub,
						roleName: jwt.roleName,
						languageId: jwt.languageId,
					},
				},
				isConnected: {
					$set: true,
				},
			},
		})
	},
	[ActionsTypes.GET_LOGIN_FAILURE]: (state: any, payload: any): any =>
		update(state, {
			user: {
				isLoading: {
					$set: false,
				},
				error: {
					$set: payload.error,
				},
				isConnected: {
					$set: false,
				},
			},
		}),
	[ActionsTypes.GET_LOGOUT]: (state: any): any => {
		const initUser = cloneDeep(initialState.user)
		//payload.tokenObject.clearSingle()
		Store.remove('user')

		return update(state, {
			user: {
				$set: { ...initUser },
			},
		})
	},
	[ActionsTypes.GET_CURRENT_USER]: (state: any, payload: any) => {
		const user = Store.get('user')
		const jwt: Jwt = jwtDecode(user?.authenticationToken)

		return update(state, {
			user: {
				identity: {
					$set: {
						privileges: jwt.privileges,
						firstName: jwt.firstName,
						lastName: jwt.lastName,
						email: jwt.sub,
						roleName: jwt.roleName,
						languageId: jwt.languageId,
					},
				},
				isConnected: {
					$set: true,
				},
			},
		})
	},
}

export default login
