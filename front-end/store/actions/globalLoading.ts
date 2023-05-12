///////COMPONENTS///////
import ActionsTypes from '../../constants/ActionsTypes'
import { ActionsArgs } from '../../interfaces/store/store.interfaces'

const globalLoading = {
	startLoading: (): ActionsArgs => ({
		type: ActionsTypes.START_LOADING,
		payload: {},
	}),
	endLoading: (): ActionsArgs => ({
		type: ActionsTypes.END_LOADING,
		payload: {},
	}),
	startDataFetcherLoading: (): ActionsArgs => ({
		type: ActionsTypes.START_DATA_FETCHER,
		payload: {},
	}),
	endDataFetcherLoading: (): ActionsArgs => ({
		type: ActionsTypes.END_DATA_FETCHER,
		payload: {},
	}),
}

export default globalLoading
