interface queryParamsObject {
	page?: string
	size?: string
	action?: string
	sort?: string
}

/**
 * @example
 * queryParam:{
 *     page: "5",
 *     size: '50'
 * }
 *
 * @param {queryParamsObject} queryParams
 * @return {string}
 */
function createQueryParams(queryParams: queryParamsObject): string {
	let queryParamSend = queryParams.page ? `?page=${queryParams.page}` : '?'
	queryParamSend += queryParams.size ? `&size=${queryParams.size}` : ''
	queryParamSend += queryParams.action ? `&action=${queryParams.action}` : ''
	queryParamSend += queryParams.sort && queryParams.sort.length > 0 ? `&sort=${queryParams.sort}` : ''

	return queryParamSend
}
// ERROR MANAGER
/**
 *
 * @returns {string}
 */
export function GET_BEARER_TOKEN(): string {
	return `/login`
}

export function POST_CREATE_USER(): string {
	return '/create'
}

export function GET_USER(): string {
	return '/users/infos'
}

export function PUT_UPDATE_USER(): string {
	return '/users/update'
}

export function POST_ALL_CUSTOMERS(query: any): string {
	return `/customers/all?page=${query.page}&size=${query.size}`
}

export function POST_ALL_PROJECTS(query: any): string {
	return `/projects/all?page=${query.page}&size=${query.size}`
}

export function POST_ALL_BILLS(query: any): string {
	return `/bills/all?page=${query.page}&size=${query.size}`
}
