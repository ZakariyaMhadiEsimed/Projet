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
