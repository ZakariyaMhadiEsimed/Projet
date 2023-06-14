////////LIBRARY/////////
import { AxiosResponse } from 'axios'
import { isUndefined } from 'lodash'
///////COMPONENTS///////
import { put, StrictEffect, call } from 'redux-saga/effects'
import ActionsTypes from '../../constants/ActionsTypes'
import { loginActionCreators, globalLoadingActionCreators, toastSuccessActionCreators } from '../actions'
import * as R from '../../constants/Endpoint'
import { API } from '../../config/AxiosConfig'
import * as SagaEffects from 'redux-saga/effects'
import { bindActionCreators } from 'redux'
import { useDispatch } from 'react-redux'

const takeLatest = SagaEffects.takeLatest

// We need to declare type of payload and type to avoid type error in takeLatest function, otherwise if we dont declare:type:string
// We only supply payload type to the generator (const sagas)
// We also check if we need to mock the axios call. In this case, we are mocking an error case.
/////////TYPES//////////
type LoginType = {
	payload: any
	type: string
	isMocked?: boolean
	mockedError?: AxiosResponse
}
/////////TYPES//////////

//  here we use strictEffect to type generator, first arg for the yield type, void because we dont have a return, any because we dont know the type
// Fr the API we need to pass a AxiosResponse type

export const getLogin = function* ({ payload, isMocked, mockedError }: LoginType): Generator<StrictEffect | Promise<AxiosResponse<any>>, void, any> {
	const userCredentials = {
		email: payload.email,
		password: payload.password,
	}
	const apiCall = R.GET_BEARER_TOKEN()
	yield put(globalLoadingActionCreators.startLoading())
	try {
		const token = yield call(() => API.post(apiCall, userCredentials))
		const userObject: any = {
			authenticationToken: token.data.token,
		}
		if (payload.rememberMe) {
			userObject.email = payload.email
			userObject.password = payload.password
		}
		// TODO : Waiting for current user to be set
		yield put(loginActionCreators.getLoginSuccess(userObject))
	} catch (e) {
		yield put(loginActionCreators.getLoginFailure(!isUndefined(isMocked) ? mockedError : e.response))
	} finally {
		yield put(globalLoadingActionCreators.endLoading())
	}
}

const sagas = function* () {
	yield takeLatest(ActionsTypes.GET_LOGIN, getLogin)
}

export default sagas
