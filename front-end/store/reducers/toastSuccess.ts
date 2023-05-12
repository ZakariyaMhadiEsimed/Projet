////////LIBRARY/////////
import update from 'immutability-helper'
import { cloneDeep } from 'lodash'
///////COMPONENTS///////
import extendUpdate from '../../helpers/extendUpdate'
import ActionsTypes from '../../constants/ActionsTypes'

extendUpdate(update)

const toastSuccess = {
	[ActionsTypes.HYDRATE_TOAST]: (state: any, payload: any): any => {
		const toastSuccessCp = cloneDeep(state.toastSuccess)
		const successMsgParams = toastSuccessCp.successMsgParams === '' ? payload.successMsgParams : toastSuccessCp.successMsgParams
		const nextMessage = toastSuccessCp.successMsgParams === '' ? '' : payload.successMsgParams

		// When redirectRequest is not set, this was returning "" instead of false (like in initialState)
		// So this fix might be creating some side effects
		const path = payload.redirectRequest.length > 0 ? payload.redirectRequest : false
		return update(state, {
			user: {
				path: {
					$set: path,
				},
			},
			toastSuccess: {
				show: {
					$set: true,
				},
				trackClick: {
					$set: state.toastSuccess.trackClick + 1,
				},
				successMsgParams: {
					$set: successMsgParams,
				},
				nextMessage: {
					$set: nextMessage,
				},
			},
		})
	},
	[ActionsTypes.CLOSE_TOAST]: (state: any): any => {
		const successMsgParams = cloneDeep(state.toastSuccess.successMsgParams)

		return update(state, {
			toastSuccess: {
				show: {
					$set: false,
				},
				successMsgParams: {
					$set: '',
				},
				tamponClose: {
					$set: successMsgParams,
				},
				trackClick: {
					$set: 0,
				},
			},
			user: {
				path: {
					$set: false,
				},
			},
		})
	},
	[ActionsTypes.OPEN_NEXT]: (state: any): any => {
		const toastSuccessCp = cloneDeep(state.toastSuccess)

		return update(state, {
			toastSuccess: {
				show: {
					$set: true,
				},
				trackClick: {
					$set: 0,
				},
				successMsgParams: {
					$set: toastSuccessCp.nextMessage,
				},
				nextMessage: {
					$set: '',
				},
			},
		})
	},
}
export default toastSuccess
