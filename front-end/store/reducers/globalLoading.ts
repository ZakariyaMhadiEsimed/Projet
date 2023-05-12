////////LIBRARY/////////
import update from 'immutability-helper'
import extendUpdate from '../../helpers/extendUpdate'
import ActionsTypes from '../../constants/ActionsTypes'

extendUpdate(update)

const globalLoading = {
	[ActionsTypes.START_LOADING]: (state: any): any =>
		update(state, {
			globalLoading: {
				loading: {
					$set: true,
				},
				count: {
					$set: state.globalLoading.count + 1,
				},
			},
		}),
	[ActionsTypes.END_LOADING]: (state: any): any => {
		const oldState = { ...state.globalLoading }
		oldState.count = oldState.count > 0 && oldState.count - 1
		const data = !!oldState.count

		return update(state, {
			globalLoading: {
				loading: {
					$set: data,
				},
				count: {
					$set: oldState.count,
				},
			},
		})
	},
	[ActionsTypes.START_DATA_FETCHER]: (state: any): any =>
		update(state, {
			globalLoading: {
				dataFetching: {
					$set: true,
				},
			},
		}),

	[ActionsTypes.END_DATA_FETCHER]: (state: any): any =>
		update(state, {
			globalLoading: {
				dataFetching: {
					$set: false,
				},
			},
		}),
}

export default globalLoading
