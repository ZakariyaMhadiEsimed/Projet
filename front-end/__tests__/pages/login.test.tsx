import '@testing-library/jest-dom'
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import axios, { AxiosError, AxiosResponse } from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { Provider } from 'react-redux'
import configureStore from 'redux-mock-store'
import Login from '../../pages/login'
import initialState from '../../store/initialState'
import * as R from '../../constants/Endpoint'
import { globalLoadingActionCreators, loginActionCreators } from '../../store/actions'
import { getLogin } from '../../store/sagas/login'
import { expectSaga } from 'redux-saga-test-plan'
import reducers from '../../store/reducers'
import * as matchers from 'redux-saga-test-plan/matchers'
import { API } from '../../config/AxiosConfig'
import { throwError } from 'redux-saga-test-plan/providers'
import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { TextEncoder } from 'util'
import React from 'react'

jest.mock('next/router', () => require('next-router-mock'))

jest.mock('react-i18next', () => ({
	// This mock makes sure any components using the translate hook can use it without a warning being shown
	useTranslation: () => {
		return {
			t: (str) => str,
			i18n: {
				changeLanguage: () => new Promise(() => {}),
			},
		}
	},
}))

global.TextEncoder = TextEncoder

configure({ adapter: new Adapter() })

describe('Login', () => {
	const mockStore = configureStore()
	let mock
	let store

	beforeAll(() => {
		mock = new MockAdapter(axios)
	})

	beforeEach(() => {
		store = mockStore(() => initialState)
	})

	afterEach(() => {
		mock.reset()
	})

	it('controls an empty login attempt', async () => {
		// Rendering page
		await act(async () => {
			render(
				<Provider store={store}>
					<Login />
				</Provider>
			)
		})

		// Targetting our submit button, we expect his loading in DOM
		expect(screen.getByTestId('login-submit-button')).toBeInTheDocument()
		const submitButton = screen.getByTestId('login-submit-button')

		await act(() => {
			fireEvent.click(submitButton)
		})

		expect(screen.getByTestId('password-error-message')).toBeInTheDocument()
		expect(screen.getByTestId('password-error-message')).toHaveTextContent('common:common_text_error_required')
		// Simulates login calls
	})

	it('controls wrong login attempts', async () => {
		// Testing redux action
		const loginData = { username: 'wronglogin', password: 'wrongpassword' }

		const errorObj: AxiosResponse = {
			data: {
				errorCode: 120,
				errorDate: '2022-12-21T15:32:03.586565762',
				message: 'Unable to find User [username = wronglogin]',
			},
			status: 400,
			statusText: 'Bad Request',
			headers: {},
			config: {},
			request: {},
		}

		const testError = new AxiosError()
		testError.response = errorObj

		store = await expectSaga(getLogin, {
			payload: loginData,
			type: loginActionCreators.getLogin(loginData).type,
			isMocked: true,
			mockedError: errorObj,
		})
			.withReducer(reducers)
			.put(globalLoadingActionCreators.startLoading())
			.provide([[matchers.call.fn(() => API.post(R.GET_BEARER_TOKEN(), loginData)), throwError(testError)]])
			.put({ type: 'GET_LOGIN_FAILURE', payload: { error: errorObj } })
			.put(globalLoadingActionCreators.endLoading())
			.run()

		//Rendering page
		await act(async () => {
			render(
				<Provider store={mockStore(store.storeState)}>
					<Login />
				</Provider>
			)
		})

		expect(screen.getByTestId('password-error-message')).toBeInTheDocument()
		expect(screen.getByTestId('password-error-message')).toHaveTextContent('login:page_login_form_error_lessFiveTentatives')

		// Testing saga call scheme
		/*testSaga(() => getLogin({ payload: loginData, type: actionReturnValue.type }))
			// Advance saga with next()
			.next()
			// Assert that the saga yields take with "START_LOADING" as type
			.put(globalLoadingActionCreators.startLoading())
			// Pass back in a value to a saga after it yields
			.next()
			// AXIOS API CALL
			.next()
			// Failure because of wrong credentials
			.put({ payload: { error: undefined }, type: 'GET_LOGIN_FAILURE' })
			.next()
			.put(globalLoadingActionCreators.endLoading())
			.next()
			.isDone()*/

		// Alternative way to test saga (no mocking)
		// const dispatched: any = []
		// await runSaga(
		// 	{
		// 		dispatch: (action) => dispatched.push(action),
		// 	},
		// 	() => getLogin({ payload: loginData, type: actionReturnValue.type })
		// ).toPromise()
	})

	// TODO : To revamp later
	/*it('shows more than five attempts to login', async () => {
		const mockLoginError = jest.fn((username, password, rememberMe) => {
			store.dispatch(loginActionCreators.getLoginFailure(new Error('ahi')))
			const actions = store.getActions()
			//expect(actions).toEqual([{ type: 'GET_LOGIN_FAILURE' }])
			console.log(store.getState())
		})
		//Rendering page
		await act(async () =>
			render(
				<Provider store={store}>
					<Login mockLogin={mockLoginError} />
				</Provider>
			)
		)

		const inputLogin = screen.getByTestId('input-login')
		const inputPassword = screen.getByTestId('input-password')
		const submitButton = screen.getByTestId('login-submit-button')

		fireEvent.input(inputLogin, {
			target: {
				value: 'wronglogin',
			},
		})

		fireEvent.input(inputPassword, {
			target: {
				value: 'wrongpassword',
			},
		})

		fireEvent.submit(submitButton)

		await waitFor(() => expect(mockLoginError).toBeCalledWith('wronglogin', 'wrongpassword'))
	})*/
})
