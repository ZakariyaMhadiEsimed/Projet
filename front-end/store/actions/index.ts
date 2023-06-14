///////COMPONENTS///////
import login from './login'
import globalLoading from './globalLoading'
import toastSuccess from './toastSuccess'
import errorManager from './errorManager'
import modals from './modals'
import exportDatas from './exportDatas'

export const loginActionCreators = {
	...login,
}
export const globalLoadingActionCreators = {
	...globalLoading,
}
export const toastSuccessActionCreators = {
	...toastSuccess,
}
export const errorManagerActionCreators = {
	...errorManager,
}
export const modalsActionCreators = {
	...modals,
}
export const exportDatasActionCreators = {
	...exportDatas,
}
