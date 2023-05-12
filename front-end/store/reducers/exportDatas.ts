////////LIBRARY/////////
import update from 'immutability-helper'
import extendUpdate from '../../helpers/extendUpdate'
import ActionsTypes from '../../constants/ActionsTypes'

extendUpdate(update)

const exportData = {
	[ActionsTypes.POST_EXPORT_DATAS]: (state: any): any =>
		update(state, {
			exportData: {
				isLoading: {
					$set: true,
				},
			},
		}),
	[ActionsTypes.POST_EXPORT_DATAS_SUCCESS]: (state: any, payload: any): any => {
		return update(state, {
			exportData: {
				isLoading: {
					$set: false,
				},
			},
		})
	},
	[ActionsTypes.POST_EXPORT_DATAS_FAILURE]: (state: any, payload: any): any =>
		update(state, {
			exportData: {
				isLoading: {
					$set: false,
				},
				error: {
					$set: payload.error,
				},
			},
		}),
}

export default exportData
