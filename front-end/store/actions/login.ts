///////COMPONENTS///////
import ActionsTypes from '../../constants/ActionsTypes'
import Tokens from '../../helpers/Store'
import { ActionsArgs } from '../../interfaces/store/store.interfaces'

const login = {
	getLogout: (tokenObject: Tokens): ActionsArgs => ({
		type: ActionsTypes.GET_LOGOUT,
		payload: {
			tokenObject: tokenObject,
		},
	}),
	getCurrentUser: (token: string): ActionsArgs => ({
		type: ActionsTypes.GET_CURRENT_USER,
		payload: {
			token,
		},
	}),
	getLogin: (user: any): ActionsArgs => ({
		type: ActionsTypes.GET_LOGIN,
		payload: {
			...user,
		},
	}),
	getLoginSuccess: (user: any): ActionsArgs => ({
		type: ActionsTypes.GET_LOGIN_SUCCESS,
		payload: {
			user,
		},
	}),
	getLoginFailure: (error: any): ActionsArgs => ({
		type: ActionsTypes.GET_LOGIN_FAILURE,
		payload: {
			error,
		},
	}),
}

export default login
