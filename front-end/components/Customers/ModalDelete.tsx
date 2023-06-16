import Modals from '../Modals'
import { ModalTitle } from '../Modals/ModalPaper/ModalPaper'
import { Button, ModalsBodyContainer } from '../../theme/GlobalCss'
import React from 'react'
import theme from '../../theme/theme'
import API_TOKEN from '../../config/AxiosConfig'
import Store from '../../helpers/Store'
import * as R from '../../constants/Endpoint'

interface ModalDeleteProps {
	showModal: boolean
	closeModalHandler: () => void
	id?: number
}
const ModalDelete = (props: ModalDeleteProps) => {
	const fetchCreateCustomer = async (data: any): Promise<any> => {
		const token = Store.get('user')
		const users = await API_TOKEN(token.authenticationToken)
			.post(R.POST_CREATE_CUSTOMER(), data)
			.then((res) => res.data)
			.catch((e) => {
				return { error: true, message: JSON.stringify(e) }
			})
		if (!users.error) {
			return users
		}
	}
	const handleDelete = () => {
		console.log('debug : ', props)
	}

	return (
		<Modals showModal={props.showModal} closeModalHandler={props.closeModalHandler}>
			<ModalTitle>{'Suppression'}</ModalTitle>
			<ModalsBodyContainer>
				Etes vous certain de vouloir ce client ?
				<Button
					type="submit"
					width={100}
					height={50}
					backgroundColor={theme.colors.primary}
					color={theme.colors.white}
					hoverBackgroundColor={theme.colors.primary_200}
					percentUnit={true}
					fontSize={theme.text.fontSize.fl}
					value={'Confirmer'}
					onClick={() => handleDelete()}
				/>
			</ModalsBodyContainer>
		</Modals>
	)
}

export default ModalDelete
