////////LIBRARY/////////
import { isUndefined } from 'lodash'
import { AxiosResponse } from 'axios'
///////COMPONENTS///////
import ActionsTypes from '../../constants/ActionsTypes'
import { errorManagerActionCreators, globalLoadingActionCreators, modalsActionCreators } from '../actions'
import { put, StrictEffect } from 'redux-saga/effects'
import * as SagaEffects from 'redux-saga/effects'
import { uriList } from '../../constants/RouteList'

const takeLatest = SagaEffects.takeLatest

// TODO : Error handling in reducer should be improved, but we are waiting for back to do so
/////////TYPES//////////
type ErrorManagerPayloadType = {
	payload: any;
	type: string
}
/////////TYPES//////////

const createError = function* ({ payload }: ErrorManagerPayloadType): Generator<StrictEffect | Promise<AxiosResponse<any>>, void, any> {

	const error = payload.error
	const redirectPath = payload.redirectPath
	let modal

	yield put(globalLoadingActionCreators.endLoading())
	if (!isUndefined(error)) {
		if (!isUndefined(error.status)) {
			switch (error.status) {
				case 500:
					modal = {
						level: 'error',
						title: 'common:common_text_modal_defaultError_title',
						message: 'common:common_text_modal_defaultError_body',
						show: true,
						path: redirectPath,
						insideModalResponse: true,
					}

					yield put(modalsActionCreators.hydrateModal(modal))
					break

				case 503:
					yield put(errorManagerActionCreators.modeMaintenance(uriList.maintenance))
					break

				case 404:
					modal = {
						level: 'error',
						title: 'common:common_text_modal_error404_title',
						message: 'common:common_text_modal_error404_body',
						show: true,
						path: redirectPath,
						insideModalResponse: true,
					}

					yield put(modalsActionCreators.hydrateModal(modal))
					break

				case 200:
					modal = {
						level: 'error',
						title: 'modal__error200PartialSuccess__title',
						message: 'modal__error200PartialSuccess__body',
						show: true,
						path: redirectPath,
						insideModalResponse: true,
					}

					yield put(modalsActionCreators.hydrateModal(modal))
					break

				case 400:
					modal = {
						level: 'error',
						title: 'common:common_text_modal_error400_title',
						message: error.data.message,
						errorMsgParams: error.data.msgParameters,
						show: true,
						path: redirectPath,
						insideModalResponse: true,
					}
					yield put(modalsActionCreators.hydrateModal(modal))
					break

				case 401:
					modal = {
						level: 'error',
						title: 'common:common_text_modal_error401_title',
						message: error.data.message,
						errorMsgParams: error.data.msgParameters,
						show: true,
						path: redirectPath,
						insideModalResponse: true,
					}
					yield put(modalsActionCreators.hydrateModal(modal))
					break

				default:
					modal = {
						level: 'error',
						title: 'common:common_text_modal_defaultError_title',
						message: 'common:common_text_modal_defaultError_body',
						show: true,
						path: redirectPath,
						insideModalResponse: true,
					}

					yield put(modalsActionCreators.hydrateModal(modal))
					break
			}
		} else {
			modal = {
				level: 'error',
				title: 'common:common_text_modal_defaultError_title',
				message: 'common:common_text_modal_defaultError_body',
				show: true,
				path: redirectPath,
				insideModalResponse: true,
			}
			yield put(modalsActionCreators.hydrateModal(modal))
		}
	} else {
		modal = {
			level: 'error',
			title: 'common:common_text_modal_defaultError_title',
			message: 'common:common_text_modal_defaultError_body',
			show: true,
			path: redirectPath,
			insideModalResponse: true,
		}
		yield put(modalsActionCreators.hydrateModal(modal))
	}
}

const sagas = function* () {
	yield takeLatest(ActionsTypes.CREATE_ERROR, createError)
}

export default sagas
