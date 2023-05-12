const initialState = {
	
	user: {
		isLoading: false,
		isConnected: false,
		identity: {
			privileges:[],
			firstName: '',
			lastName: '',
			userName: '',
			roleName: '',
			languageId: 1
		},
		error: {},
	},
	modal: {
		message: false,
		title: '',
		level: '',
		show: false,
		errorMsgParams: [],
		path: '',
		insideModalResponse: false,
	},
	error: {
		status: '',
		msg: '',
	},
	globalLoading: {
		loading: false,
		count: 0,
		dataFetching: false,
	},
	toastSuccess: {
		show: false,
		trackClick: 0,
		successMsgParams: '',
		nextMessage: '',
		tamponClose: '',
		path: '',
	},
	exportData: {
		isLoading: false,
		error: false,
	},
}

export default initialState
