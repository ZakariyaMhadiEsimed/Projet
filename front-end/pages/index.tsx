/* eslint-disable react-hooks/exhaustive-deps */
////////LIBRARY/////////
import { NextPage } from 'next'
import { useEffect } from 'react'
import { shallowEqual, useSelector } from 'react-redux'
import { isEqual } from 'lodash'
///////COMPONENTS///////
import { RootState } from '../interfaces/store/store.interfaces'
import { uriList } from '../constants/RouteList'
import { useRouter } from 'next/router'

const Home: NextPage = () => {

	const { user } = useSelector(
		(state: RootState) => ({
			user: state.user,
		}),
		shallowEqual
	)
	const router = useRouter()

	/////////////////////////////// USE EFFECT /////////////////////////////////////

	// Test user profile to do the proper redirect
	// Note that here, we are authenticated
	useEffect(() => {
		if (!isEqual(user.identity, {}) && user.isConnected) {
			router.replace(uriList.users)
		} else {
			router.replace(uriList.login)
		}
	}, [user])

	///////////////////////////////// RENDER ///////////////////////////////////////

	return <></>
}

export default Home
