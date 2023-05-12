///////COMPONENTS///////
import ActionsTypes from '../../constants/ActionsTypes'
import { ActionsArgs } from '../../interfaces/store/store.interfaces'

const modals = {
	hydrateModal: (data: any): ActionsArgs => ({
		type: ActionsTypes.HYDRATE_MODAL,
		payload: {
			data,
		},
	}),
	closeModal: (): ActionsArgs => ({
		type: ActionsTypes.CLOSE_MODAL,
		payload: {},
	}),
	closeModalRedirect: (): ActionsArgs => ({
		type: ActionsTypes.CLOSE_MODAL_REDIRECT,
		payload: {},
	}),

	/**
	 * Open and hydrate modal content
	 * @param {string} content
	 * @param {boolean} insideModal
	 * @return {ActionsArgs}
	 */
	tooltipHelpOpen: (content: string, insideModal = false): ActionsArgs => ({
		type: ActionsTypes.OPEN_TOOLTIP_HELP,
		payload: { content, insideModal },
	}),
	/**
	 * Close and reset data
	 * @return {{payload: {}, type: string}}
	 */
	tooltipHelpClose: (): ActionsArgs => ({
		type: ActionsTypes.CLOSE_TOOLTIP_HELP,
		payload: {},
	}),
}

export default modals
