////////LIBRARY/////////
import update from 'immutability-helper'
import { cloneDeep, isEmpty } from 'lodash'
///////COMPONENTS///////
import extendUpdate from '../../helpers/extendUpdate'
import ActionsTypes from '../../constants/ActionsTypes'

extendUpdate(update)

// TODO : Error handling in reducer should be improved, but we are waiting for back to do so

const modals = {
	[ActionsTypes.HYDRATE_MODAL]: (state: any, payload: any): any => {
		const modalInput = payload.data
		const modal = {
			message: !isEmpty(modalInput.message) ? modalInput.message : modalInput.message,
			title: modalInput.title,
			level: modalInput.level,
			show: modalInput.show,
			path: modalInput.path,
			errorMsgParams: modalInput.errorMsgParams || [],
			insideModalResponse: modalInput.insideModalResponse,
		}
		return update(state, {
			modal: {
				$set: { ...modal },
			},
		})
	},
	[ActionsTypes.CLOSE_MODAL]: (state: any): any => {
		return update(state, {
			user: {
				path: {
					$set: '',
				},
			},
			modal: {
				message: {
					$set: false,
				},
				title: {
					$set: '',
				},
				level: {
					$set: '',
				},
				show: {
					$set: false,
				},
				errorMsgParams: {
					$set: [],
				},
				insideModalResponse: {
					$set: false,
				},
			},
		})
	},
	[ActionsTypes.CLOSE_MODAL_REDIRECT]: (state: any): any => {
		const path = cloneDeep(state.modal.path)

		return update(state, {
			user: {
				path: {
					$set: path,
				},
			},
			modal: {
				message: {
					$set: false,
				},
				title: {
					$set: '',
				},
				level: {
					$set: '',
				},
				show: {
					$set: false,
				},
				errorMsgParams: {
					$set: [],
				},
				insideModalResponse: {
					$set: false,
				},
			},
		})
	},

	[ActionsTypes.OPEN_TOOLTIP_HELP]: (state: any, payload: any): any => {
		return update(state, {
			tooltipHelp: {
				showModal: {
					$set: true,
				},
				content: {
					$set: payload.content,
				},
				insideModal: {
					$set: payload.insideModal,
				},
			},
		})
	},
	[ActionsTypes.CLOSE_TOOLTIP_HELP]: (state: any): any => {
		return update(state, {
			tooltipHelp: {
				showModal: {
					$set: false,
				},
				content: {
					$set: '',
				},
				insideModal: {
					$set: false,
				},
			},
		})
	},
}
export default modals
