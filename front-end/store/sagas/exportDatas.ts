////////LIBRARY/////////
import { AxiosResponse } from 'axios'
///////COMPONENTS///////
import { put, StrictEffect } from 'redux-saga/effects'
import ActionsTypes from '../../constants/ActionsTypes'
import { globalLoadingActionCreators, errorManagerActionCreators, exportDatasActionCreators } from '../actions'
import * as R from '../../constants/Endpoint'
import { API_TOKEN_DL_FILE } from '../../config/AxiosConfig'
import * as SagaEffects from 'redux-saga/effects'
import Store from '../../helpers/Store'

const takeLatest = SagaEffects.takeLatest

//  we need to declare type of payload and type to avoid type error in takeLatest function, otherwise if we dont declare:type:string
//  we only supply payload type to the generator (const sagas)

/////////TYPES//////////
type ExportDatasPayloadType = {
	payload: any;
	type: string
}
/////////TYPES//////////

const postExportDatas = function* ({ payload }: ExportDatasPayloadType): Generator<StrictEffect | Promise<AxiosResponse<any>>, void, any> {

	const url = payload.url
	const bodyMsg = payload.filters
	const user = Store.get('user')
	const apiCall = R.POST_EXPORT_DATAS(url)

	yield put(globalLoadingActionCreators.startLoading())

	try {
		const data = yield API_TOKEN_DL_FILE(user.authenticationToken).post(apiCall, bodyMsg)
		yield put(exportDatasActionCreators.postExportDatasSuccess(data.data))

		// Some export might send no content
		if (data.status === 200) {
			const filename = data.headers['content-disposition'].split('=')[1]
			const type = data.headers['content-type']
			const url = window.URL.createObjectURL(new Blob([data.data], { type: type }))
			const a = document.createElement('a')
			a.href = url
			a.setAttribute('download', filename)
			document.body.appendChild(a)
			a.click()
			document.body.removeChild(a)
		}
	} catch (e: any) {
		yield put(errorManagerActionCreators.createError(e.response))
		yield put(exportDatasActionCreators.postExportDatasFailure(e.response))
	} finally {
		yield put(globalLoadingActionCreators.endLoading())
	}
}

const sagas = function* () {
	yield takeLatest(ActionsTypes.POST_EXPORT_DATAS, postExportDatas)
}

export default sagas