////////LIBRARY/////////
import { AnyAction } from 'redux'
///////COMPONENTS///////
import login from './login'
import globalLoading from './globalLoading'
import toastSuccess from './toastSuccess'
import modals from './modals'
import errorManager from './errorManager'
import initialState from '../initialState'
import { HYDRATE } from 'next-redux-wrapper'

const reducersMap: Record<string, any> = {
	...login,
	...globalLoading,
	...toastSuccess,
	...modals,
	...errorManager,
	leaveStateUnchanged: (state: any): any => state,
}

const reducers = (state = initialState, action: AnyAction): any => {
	if (action.type === HYDRATE) {
		return { ...state, ...action.payload }
	} else {
		const reducer = reducersMap[action.type] || reducersMap.leaveStateUnchanged

		const newState = reducer(state, action.payload, action.meta)
		return newState
	}
}

export default reducers
