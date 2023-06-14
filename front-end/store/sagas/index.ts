///////COMPONENTS///////
import { fork } from 'redux-saga/effects'
import login from './login'
import errorManager from './errorManager'
import exportDatas from './exportDatas'

const sagas = function* () {
	yield fork(login)
	yield fork(errorManager)
	yield fork(exportDatas)
}

export default sagas
