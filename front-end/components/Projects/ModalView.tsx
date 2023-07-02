import Modals from '../Modals'
import { ModalTitle } from '../Modals/ModalPaper/ModalPaper'
import { ModalsBodyContainer } from '../../theme/GlobalCss'
import React, { useEffect, useState } from 'react'
import API_TOKEN from '../../config/AxiosConfig'
import Store from '../../helpers/Store'
import * as R from '../../constants/Endpoint'
import { referentialStatusProject } from './ModalAdd'
import { ItemStatus } from '../../pages/projects'

interface ModalAddProps {
	showModal: boolean
	closeModalHandler: () => void
	id?: number | null
}
const ModalView = (props: ModalAddProps) => {
	const [nameToDisplay, setNameToDisplay] = useState<string>('')
	const [customerName, setCustomerName] = useState<string>('')
	const [data, setData] = useState<any>({})
	const fetchGetProjects = async (): Promise<any> => {
		const token = Store.get('user')
		if (props.id) {
			const users = await API_TOKEN(token.authenticationToken)
				.get(R.GET_PROJECT(props.id))
				.then((res) => res.data)
				.catch((e) => {
					return { error: true, message: JSON.stringify(e) }
				})
			if (!users.error) {
				return users
			}
		}
	}

	const fetchGetCustomers = async (): Promise<any> => {
		const token = Store.get('user')
		if (props.id) {
			const users = await API_TOKEN(token.authenticationToken)
				.get(R.GET_CUSTOMER(data.customerId))
				.then((res) => res.data)
				.catch((e) => {
					return { error: true, message: JSON.stringify(e) }
				})
			if (!users.error) {
				return users
			}
		}
	}

	useEffect(() => {
		if (props.id && props.showModal) {
			fetchGetProjects().then((r) => {
				setNameToDisplay(r?.name)
				setData(r)
				fetchGetCustomers().then((r) => setCustomerName(r.firstName + ' ' + r?.lastName))
			})
		} else setNameToDisplay('Nouveau client')
	}, [props.showModal])

	return (
		<Modals showModal={props.showModal} closeModalHandler={props.closeModalHandler}>
			<ModalTitle>{nameToDisplay}</ModalTitle>
			<ModalsBodyContainer>
				<div style={{ marginBottom: '10px', marginTop: '30px' }}>
					Abbréviation : <span style={{ fontSize: '15px', color: '#BB464B', fontWeight: '500' }}>{data.abbreviation}</span>
				</div>
				<div style={{ marginBottom: '10px', marginTop: '30px', display: 'flex' }}>
					Statut :{' '}
					<div style={{ marginLeft: '25px', display: 'flex', alignItems: 'center', flexDirection: 'row' }}>
						<ItemStatus statusId={data.statusId} />
						{referentialStatusProject[data.statusId]}
					</div>
				</div>
				<div style={{ marginBottom: '10px', marginTop: '30px' }}>
					Nom du client associé : <span style={{ fontSize: '15px', color: '#BB464B', fontWeight: '500' }}>{customerName}</span>
				</div>
			</ModalsBodyContainer>
		</Modals>
	)
}

export default ModalView
