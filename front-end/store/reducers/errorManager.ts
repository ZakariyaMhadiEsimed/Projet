////////LIBRARY/////////
import update from 'immutability-helper'
///////COMPONENTS///////
import extendUpdate from '../../helpers/extendUpdate'
import ActionsTypes from '../../constants/ActionsTypes'
//import { uriList } from '../../routings/settings/RouteList'

extendUpdate(update)

const errorManager = {
	[ActionsTypes.CREATE_ERROR]: (state: any, payload: { redirectPath: string }): any => {
		return update(state, {
			user: {
				path: {
					$set: payload.redirectPath,
				},
			},
		})
	},
	[ActionsTypes.CREATE_CRITICAL_ERROR]: (state: any): any => {
		return update(state, {
			user: {
				path: {
					$set: '' /*uriList.criticalError*/,
				},
			},
		})
	},
	[ActionsTypes.CREATE_MAINTENANCE_MODE]: (state: any, payload: { redirectPath: string }): any => {
		return update(state, {
			user: {
				path: {
					$set: payload.redirectPath,
				},
			},
		})
	},
}

export default errorManager
