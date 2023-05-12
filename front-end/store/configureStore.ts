////////LIBRARY/////////
import { createStore, applyMiddleware, Store, AnyAction } from 'redux'
import createSagaMiddleware, { Task } from 'redux-saga'
import { createWrapper /*Context*/ } from 'next-redux-wrapper'
import { composeWithDevTools } from 'redux-devtools-extension'
///////COMPONENTS///////
import reducer from './reducers'
import rootSaga from './sagas'

///////INTERFACES///////
export interface SagaStore extends Store {
	sagaTask: Task
}
///////INTERFACES///////

const composeEnhancers = composeWithDevTools({ trace: true, traceLimit: 25 })

export const store = (/*context: Context*/): Store<any, AnyAction> & { dispatch: any } => {

	const sagaMiddleware = createSagaMiddleware()
	// eslint-disable-next-line prettier/prettier
	const store = createStore(reducer, composeEnhancers(applyMiddleware(sagaMiddleware)));
	;(store as SagaStore).sagaTask = sagaMiddleware.run(rootSaga)

	return store
}

export const wrapper = createWrapper<SagaStore>(store as any)
