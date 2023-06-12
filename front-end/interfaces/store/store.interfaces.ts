export interface RootState {
	user: {
		isLoading: boolean
		isConnected: boolean
		identity: userIdentity
		error: any
		path: string
	}
	modal: any
	globalLoading: {
		loading: boolean
		count: number
		dataFetching: boolean
	}
	toastSuccess: {
		show: boolean
		trackClick: number
		successMsgParams: string
		nextMessage: string
		tamponClose: string
		path: string
	}
}

export interface userIdentity {
	userId(userId: any): string
	idUser: number
	userName: string
	firstName: string
	lastName: string
	idRole: 'ADMIN' | 'DEV' | 'STD'
	privileges: Array<number>
	picture: string
}

export enum PrivilegeType {
	ACC_ACT = 'ACC_ACT',
	USER_MENU = 'USER_MENU',
	ACC_MENU = 'ACC_MENU',
	FILE_PAGE = 'FILE_PAGE',
	USER_LIST = 'USER_LIST',
	DASH_PAGE = 'DASH_PAGE',
	DASH_EXP = 'DASH_EXP',
	ALERT_MENU = 'ALERT_MENU',
	ACC_PAGE = 'ACC_PAGE',
	FILE_MENU = 'FILE_MENU',
	ALERT_PAGE = 'ALERT_PAGE',
	ALERT_ACT = 'ALERT_ACT',
	USER_ACT = 'USER_ACT',
	FILE_ACT = 'FILE_ACT',
	DASH_MENU = 'DASH_MENU',
}

export interface ActionsArgs {
	type: string
	payload?: unknown
}
