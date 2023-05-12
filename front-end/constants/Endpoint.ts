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

// Is a fake endpoint, redirected after by middleware
export function SERVICE_AVAILABILITY(): string {
	return `/utils/ping`
}

// ERROR MANAGER
/**
 *
 * @returns {string}
 */
export function GET_BEARER_TOKEN(): string {
	return `/auth/jwt`
}

// TODO : Might be usefull if we want to use middleware.ts as proxy, to remove later ?
export const endpointList = [SERVICE_AVAILABILITY(), GET_BEARER_TOKEN()]
