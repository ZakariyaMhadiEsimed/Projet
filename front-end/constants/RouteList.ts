import { userPrivileges } from './PrivilegesList'

export type RouteObject = {
	path: string
	requiredPrivilege?: number | undefined
	isProtected: boolean
	titleTranslation?: string
}

export const uriList = {
	login: '/login',
	dashboard: '/dashboard',
	customers: '/customers',
	projects: '/projects',
	bill: '/bill',
}

export const routeList: Array<RouteObject> = [
	{
		path: uriList.login,
		isProtected: false,
	},
	{
		path: uriList.dashboard,
		isProtected: true,
		requiredPrivilege: userPrivileges.ADMIN,
	},
	{
		path: uriList.customers,
		isProtected: true,
		requiredPrivilege: userPrivileges.ADMIN,
	},
	{
		path: uriList.projects,
		isProtected: true,
		requiredPrivilege: userPrivileges.ADMIN,
	},
	{
		path: uriList.bill,
		isProtected: true,
		requiredPrivilege: userPrivileges.ADMIN,
	},
]
