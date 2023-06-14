///////COMPONENTS///////
import ActionsTypes from '../../constants/ActionsTypes'
import { ActionsArgs } from '../../interfaces/store/store.interfaces'

const toastSuccess = {
	hydrateToast: (successMsgParams: string, redirectRequest = ''): ActionsArgs => ({
		type: ActionsTypes.HYDRATE_TOAST,
		payload: {
			successMsgParams,
			redirectRequest,
		},
	}),
	closeToast: (): ActionsArgs => ({
		type: ActionsTypes.CLOSE_TOAST,
		payload: {},
	}),
	openNext: (): ActionsArgs => ({
		type: ActionsTypes.OPEN_NEXT,
		payload: {},
	}),
}

export default toastSuccess
