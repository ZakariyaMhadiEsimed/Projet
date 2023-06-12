import { userPrivileges } from './PrivilegesList'

export type RouteObject = {
	path: string
	requiredPrivilege?: number | undefined
	isProtected: boolean
	titleTranslation?: string
}

export const uriList = {
	login: '/login',
	users: '/users',
}

export const routeList: Array<RouteObject> = [
	{
		path: uriList.login,
		isProtected: false,
	},
	{
		path: uriList.users,
		isProtected: true,
		requiredPrivilege: userPrivileges.ADMIN,
	},
]
