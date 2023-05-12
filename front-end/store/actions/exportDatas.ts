///////COMPONENTS///////
import ActionsTypes from '../../constants/ActionsTypes'
import { ActionsArgs } from '../../interfaces/store/store.interfaces'

const exportDatas = {
	postExportDatas: (filters = {}, url = ''): ActionsArgs => ({
		type: ActionsTypes.POST_EXPORT_DATAS,
		payload: {
			filters,
			url,
		},
	}),
	postExportDatasSuccess: (data: any): ActionsArgs => ({
		type: ActionsTypes.POST_EXPORT_DATAS_SUCCESS,
		payload: {
			data,
		},
	}),
	postExportDatasFailure: (error: any): ActionsArgs => ({
		type: ActionsTypes.POST_EXPORT_DATAS_FAILURE,
		payload: {
			error,
		},
	}),
}

export default exportDatas
