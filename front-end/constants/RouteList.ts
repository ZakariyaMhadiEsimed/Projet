import { userPrivileges } from './PrivilegesList'

export type RouteObject = {
	path: string
	requiredPrivilege?: number | undefined
	isProtected: boolean
	titleTranslation?: string
}

export const uriList = {
	login: '/login',
}

export const routeList: Array<RouteObject> = [
	{
		path: uriList.login,
		isProtected: false,
	}
]
