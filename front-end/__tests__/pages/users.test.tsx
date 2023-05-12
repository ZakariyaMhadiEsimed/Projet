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
import UsersManager from '../../pages/users'

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

describe('Users', () => {
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

	it('renders', async () => {
		const mockUsers = {
			headerContent: {
				contentPaginated: {
					content: [],
					totalElements: 0,
					totalPages: 0,
				},
			},
			headerParam: {
				filters: {},
			},
		}

		// Rendering page
		await act(async () => {
			render(
				<Provider store={store}>
					<UsersManager users={mockUsers} />
				</Provider>
			)
		})
	})

	it('can delete user', async () => {
		const mockUsers = {
			headerContent: {
				contentPaginated: {
					content: [
						{
							userId: 1,
							username: 'username1',
							lastName: 'lastName1',
							firstName: 'firstName1',
							sectorName: null,
							roleName: 'admin_role',
							enabled: true,
							enabledLabel: 'user_active',
						},
						{
							userId: 2,
							username: 'username2',
							lastName: 'lastName2',
							firstName: 'firstName2',
							sectorName: null,
							roleName: 'clinic_role',
							enabled: true,
							enabledLabel: 'user_active',
						},
					],
					totalElements: 2,
					totalPages: 1,
				},
			},
			headerParam: {
				filters: {
					searchField: '',
					filtersSelection: {
						sectors: {
							filterElements: [
								{
									id: null,
									label: '',
									active: true,
								},
							],
							updated: false,
							level: 0,
						},
						roles: {
							filterElements: [
								{
									id: 1,
									label: 'admin_role',
									active: true,
								},
								{
									id: 2,
									label: 'clinic_role',
									active: true,
								},
							],
							updated: false,
							level: 1,
						},
						status: {
							filterElements: [
								{
									id: 1,
									label: 'user_active',
									active: true,
								},
							],
							updated: false,
							level: 1,
						},
					},
				},
			},
		}

		// Rendering page
		act(() => {
			render(
				<Provider store={store}>
					<UsersManager users={mockUsers} />
				</Provider>
			)
		})

		window.HTMLElement.prototype.scrollIntoView = jest.fn()

		const deleteAction = screen.getByTestId('delete-user-1')
		waitFor(() => expect(deleteAction).toBeInTheDocument())

		act(() => {
			fireEvent.click(deleteAction)
		})

		const submitButton = screen.getByTestId('submit-button-deactivate-user')
		waitFor(() => expect(submitButton).toBeInTheDocument())
	})
})
