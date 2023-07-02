/* eslint-disable react-hooks/exhaustive-deps */
////////LIBRARY/////////
import { NextPage } from 'next'
import React, { useEffect, useState } from 'react'
import { useDispatch, shallowEqual, useSelector } from 'react-redux'
import { bindActionCreators } from 'redux'
///////COMPONENTS///////
import API_TOKEN from '../../config/AxiosConfig'
import * as R from '../../constants/Endpoint'
import Store from '../../helpers/Store'
import { errorManagerActionCreators, globalLoadingActionCreators, toastSuccessActionCreators } from '../../store/actions'
import theme from '../../theme/theme'
import { RootState } from '../../interfaces/store/store.interfaces'

///////INTERFACES///////

const Dashboard: NextPage<any> = (): JSX.Element | null => {
	const { user } = useSelector(
		(state: RootState) => ({
			user: state.user,
			privileges: state.user.identity.privileges,
		}),
		shallowEqual
	)
	const [data, setData] = useState<any>(undefined)
	// REDUX actions
	const actionsErrorManager = bindActionCreators(errorManagerActionCreators, useDispatch())
	const actionsGlobalLoading = bindActionCreators(globalLoadingActionCreators, useDispatch())
	const actionsToastSuccess = bindActionCreators(toastSuccessActionCreators, useDispatch())
	const [{ activeSeriesIndex, activeDatumIndex }, setState] = React.useState({
		activeSeriesIndex: -1,
		activeDatumIndex: -1,
	})

	///////////////////////////////// CONFIG ///////////////////////////////////////

	///////////////////////////////// HANDLE ///////////////////////////////////////

	const fetchDashboardData = async (): Promise<any> => {
		const token = Store.get('user')
		await API_TOKEN(token.authenticationToken)
			.get(R.GET_DASHBOARD())
			.then((res) => setData(res.data))
			.catch((e) => {
				return { error: true, message: JSON.stringify(e) }
			})
	}

	/////////////////////////////// USE EFFECT /////////////////////////////////////

	useEffect(() => {
		fetchDashboardData()
	}, [])

	///////////////////////////////// RENDER ///////////////////////////////////////
	console.log('ddebug data : ', user)
	return (
		<div style={{ backgroundColor: theme.colors.white, flex: '0 0 100%' }}>
			<div
				style={{
					margin: '20px',
					fontSize: '20px',
					color: '#BB464B',
					fontWeight: 'bold',
					textTransform: 'uppercase',
					marginBottom: '10px',
					textAlign: 'center',
				}}
			>
				Tableau de bord
			</div>
			<div
				style={{
					margin: '20px',
					border: '1px solid lightgray',
					borderRadius: '5px',
					padding: '15px',
				}}
			>
				<div style={{ marginBottom: '10px', marginTop: '10px' }}>
					Chiffre annuel payé : <span style={{ fontSize: '15px', color: '#BB464B', fontWeight: '500' }}>{data?.totalPayed || 0}€</span>
				</div>
				<div style={{ marginBottom: '10px', marginTop: '10px' }}>
					Chiffre annuel théorique: <span style={{ fontSize: '15px', color: '#BB464B', fontWeight: '500' }}>{data?.total || 0}€</span>
				</div>
				<div style={{ marginBottom: '10px', marginTop: '10px' }}>
					Chiffre annuel impayé : <span style={{ fontSize: '15px', color: '#BB464B', fontWeight: '500' }}>{data?.totalWaiting || 0}€</span>
				</div>
				<div style={{ marginBottom: '10px', marginTop: '30px' }}>
					Chiffre annuel à atteindre :{' '}
					<span style={{ fontSize: '15px', color: '#BB464B', fontWeight: '500' }}>{user.identity.CA || 0}€</span>
				</div>
			</div>
			<div
				style={{
					margin: '20px',
					border: '1px solid lightgray',
					borderRadius: '5px',
					padding: '15px',
				}}
			>
				<div
					style={{
						width: '400px',
						height: '300px',
					}}
				></div>
			</div>
		</div>
	)
}

export default Dashboard
