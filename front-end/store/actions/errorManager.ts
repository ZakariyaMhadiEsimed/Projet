///////COMPONENTS///////
import ActionsTypes from '../../constants/ActionsTypes'
import { ActionsArgs } from '../../interfaces/store/store.interfaces'

/////////TYPES//////////
interface errorObject {
	errorCode: number
	subErrorCode: number
}
/////////TYPES//////////

const errorManager = {
	createError: (error: errorObject | undefined, redirectPath = ''): ActionsArgs => ({
		type: ActionsTypes.CREATE_ERROR,
		payload: {
			error,
			redirectPath,
		},
	}),
	criticalError: (error: errorObject): ActionsArgs => ({
		type: ActionsTypes.CREATE_CRITICAL_ERROR,
		payload: {
			error,
		},
	}),
	modeMaintenance: (redirectPath: string): ActionsArgs => ({
		type: ActionsTypes.CREATE_MAINTENANCE_MODE,
		payload: {
			redirectPath,
		},
	}),
}

export default errorManager
