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

export function POST_CREATE_CUSTOMER(): string {
	return `/customers/create`
}

export function GET_CUSTOMER(id: number): string {
	return `/customers/${id}`
}
export function PUT_UPDATE_CUSTOMER(id: number): string {
	return `/customers/update/${id}`
}

export function DELETE_CUSTOMER(id: number): string {
	return `/customers/${id}`
}

export function GET_CUSTOMERS_AVAILABLE(): string {
	return '/customers'
}

export function POST_CREATE_PROJECT(): string {
	return `/projects/create`
}

export function GET_PROJECT(id: number): string {
	return `/projects/${id}`
}
export function PUT_UPDATE_PROJECT(id: number): string {
	return `/projects/update/${id}`
}

export function DELETE_PROJECT(id: number, customerId: number): string {
	return `/projects/${id}/${customerId}`
}

export function GET_PROJECT_SELECT(): string {
	return '/projects'
}
export function POST_CREATE_BILL(): string {
	return `/bills/create`
}

export function GET_BILL_SEND(id: number): string {
	return `/bills/send/${id}`
}

export function GET_BILL_PAYED(id: number): string {
	return `/bills/payed/${id}`
}

export function GET_BILL_EDIT(id: number): string {
	return `/bills/edit/${id}`
}

export function GET_BILL(id: number): string {
	return `/bills/${id}`
}

export function PUT_UPDATE_BILL(id: number): string {
	return `/bills/update/${id}`
}

export function DELETE_BILL(id: number, projectId: number): string {
	return `/bills/${id}/${projectId}`
}

export function GET_DASHBOARD(): string {
	return '/users/dashboard'
}
