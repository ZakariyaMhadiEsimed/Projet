import Modals from '../Modals'
import { ModalTitle } from '../Modals/ModalPaper/ModalPaper'
import { ModalsBodyContainer } from '../../theme/GlobalCss'
import React, { useEffect, useState } from 'react'
import API_TOKEN from '../../config/AxiosConfig'
import Store from '../../helpers/Store'
import * as R from '../../constants/Endpoint'

interface ModalAddProps {
	showModal: boolean
	closeModalHandler: () => void
	id?: number | null
}
const ModalView = (props: ModalAddProps) => {
	const [nameToDisplay, setNameToDisplay] = useState<string>('')
	const [data, setData] = useState<any>({})
	const fetchGetCustomer = async (): Promise<any> => {
		const token = Store.get('user')
		if (props.id) {
			const users = await API_TOKEN(token.authenticationToken)
				.get(R.GET_CUSTOMER(props.id))
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
			fetchGetCustomer().then((r) => {
				setNameToDisplay(r?.firstName + ' ' + r?.lastName)
				setData(r)
			})
		} else setNameToDisplay('Nouveau client')
	}, [props.showModal])

	return (
		<Modals showModal={props.showModal} closeModalHandler={props.closeModalHandler}>
			<ModalTitle>{nameToDisplay}</ModalTitle>
			<ModalsBodyContainer>
				<div style={{ marginBottom: '10px', marginTop: '30px' }}>
					Nom et Prénom du client :{' '}
					<span style={{ fontSize: '15px', color: '#BB464B', fontWeight: '500' }}>
						{data.firstName} {data.lastName}
					</span>
				</div>
				<div style={{ marginBottom: '10px', marginTop: '30px' }}>
					Adresse postal : <span style={{ fontSize: '15px', color: '#BB464B', fontWeight: '500' }}>{data.postalAdress}</span>
				</div>
				<div style={{ marginBottom: '10px', marginTop: '30px' }}>
					Adresse email : <span style={{ fontSize: '15px', color: '#BB464B', fontWeight: '500' }}>{data.email}</span>
				</div>
				<div style={{ marginBottom: '10px', marginTop: '30px' }}>
					Téléphone : <span style={{ fontSize: '15px', color: '#BB464B', fontWeight: '500' }}>{data.phone}</span>
				</div>
				<div style={{ marginBottom: '10px', marginTop: '30px' }}>
					Statut :{' '}
					<span style={{ fontSize: '15px', color: '#BB464B', fontWeight: '500' }}>
						{data.isCompany == 0 ? 'Particulier' : 'Professionnel'}
					</span>
				</div>
			</ModalsBodyContainer>
		</Modals>
	)
}

export default ModalView
