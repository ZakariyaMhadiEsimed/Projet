import Modals from '../Modals'
import { ModalTitle } from '../Modals/ModalPaper/ModalPaper'
import {
	Button,
	FormHandler,
	InputErrorMessage,
	InputLabel,
	InputLabelWrapper,
	ModalsBodyContainer,
	PageFormColumnWrapper,
	PageFormFieldWrapper,
	StyledInput,
} from '../../theme/GlobalCss'
import { Controller, useForm } from 'react-hook-form'
import { isEmpty, isNull, isUndefined } from 'lodash'
import React, { useEffect, useState } from 'react'
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import theme from '../../theme/theme'
import API_TOKEN from '../../config/AxiosConfig'
import Store from '../../helpers/Store'
import * as R from '../../constants/Endpoint'
import styled from 'styled-components'
import FormSelect from '../Form/FormSelect'

export const RadioListContainer = styled.div`
	display: flex;
	align-items: center;
	margin-left: 1rem;
	margin-top: 0.75rem;
	margin-bottom: 2rem;
`
export const OptionStyled = styled.option`
	font-family: arial, serif;
	font-size: 14px;
	font-weight: 500;
	font-style: normal;
`
interface ModalAddProps {
	showModal: boolean
	closeModalHandler: () => void
	id?: number
}

const statusSelect = [
	{ label: 'Propsect', id: 0 },
	{ label: 'Devis envoyé', id: 1 },
	{ label: 'Devis accepté', id: 2 },
	{ label: 'Démarré', id: 3 },
	{ label: 'Terminé', id: 4 },
	{ label: 'Annulé', id: 5 },
]
export const referentialStatusProject = ['Prospect', 'Devis envoyé', 'Devis accepté', 'Démarré', 'Terminé', 'Annulé']
const ModalAdd = (props: ModalAddProps) => {
	const registerFormSchema = Yup.object().shape({
		customerId: Yup.string().required('Champ requis !'),
		name: Yup.string().required('Champ requis !').max(150, 'Nombre de caractères trop élevé !'),
		statusId: Yup.string(),
	})
	const [nameToDisplay, setNameToDisplay] = useState<string>('')
	const [customersAvailable, setCustomersAvailable] = useState<any | undefined>(undefined)
	const {
		control,
		handleSubmit,
		formState: { errors },
		setValue,
	} = useForm({
		resolver: yupResolver(registerFormSchema),
	})

	const fetchCreateProject = async (data: any): Promise<any> => {
		const token = Store.get('user')
		const users = await API_TOKEN(token.authenticationToken)
			.post(R.POST_CREATE_PROJECT(), data)
			.then((res) => res.data)
			.catch((e) => {
				return { error: true, message: JSON.stringify(e) }
			})
		if (!users.error) {
			return users
		}
	}

	const fetchUpdateProject = async (data: any): Promise<any> => {
		const token = Store.get('user')
		if (!isNull(props.id)) {
			const customer = await API_TOKEN(token.authenticationToken)
				.put(R.PUT_UPDATE_PROJECT(props.id), data)
				.then((res) => res.data)
				.catch((e) => {
					return { error: true, message: JSON.stringify(e) }
				})
			if (!customer.error) {
				return customer
			}
		}
	}

	const fetchGetProject = async (): Promise<any> => {
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

	const fetchGetAvailableProjects = async (): Promise<any> => {
		const token = Store.get('user')
		const users = await API_TOKEN(token.authenticationToken)
			.get(R.GET_CUSTOMERS_AVAILABLE())
			.then((res) => res.data)
			.catch((e) => {
				return { error: true, message: JSON.stringify(e) }
			})
		if (!users.error) {
			return users
		}
	}

	const onSubmit = async (data: any): Promise<void> => {
		if (!isNull(props.id)) {
			await fetchUpdateProject(data)
		} else {
			await fetchCreateProject(data)
		}
		props.closeModalHandler()
	}

	useEffect(() => {
		if (!isNull(props.id) && props.showModal) {
			fetchGetProject().then((r) => {
				setValue('name', r?.name)
				setValue('customerId', r?.customerId)
				setValue('statusId', r?.statusId)
				setNameToDisplay(r?.name)
			})
		} else setNameToDisplay('Nouveau projet')
		fetchGetAvailableProjects().then((r) => setCustomersAvailable(r))
	}, [props.showModal])

	return (
		<Modals showModal={props.showModal} closeModalHandler={props.closeModalHandler}>
			<ModalTitle>{nameToDisplay}</ModalTitle>
			<ModalsBodyContainer>
				<form onSubmit={handleSubmit(onSubmit)}>
					<FormHandler formCols={3}>
						<PageFormColumnWrapper>
							<PageFormFieldWrapper>
								<InputLabelWrapper>
									<InputLabel>
										Nom du projet <span style={{ color: 'red' }}>*</span>
									</InputLabel>
									{errors.name && <InputErrorMessage>{errors.name.message?.toString()}</InputErrorMessage>}
								</InputLabelWrapper>
								<Controller
									control={control}
									name={`name`}
									render={({ field: { onChange, value, name } }) => (
										<StyledInput
											onChange={onChange}
											value={value}
											name={name}
											data-testid="name"
											type="text"
											hasError={!isUndefined(errors.name)}
											placeholder={'Saisissez le nom du projet'}
										/>
									)}
								/>
							</PageFormFieldWrapper>
						</PageFormColumnWrapper>
						<PageFormColumnWrapper>
							<PageFormFieldWrapper>
								<InputLabelWrapper>
									<InputLabel>
										Client associé <span style={{ color: 'red' }}>*</span>
									</InputLabel>
									{errors.customerId && <InputErrorMessage>{errors.customerId.message?.toString()}</InputErrorMessage>}
								</InputLabelWrapper>
								<Controller
									control={control}
									name={`customerId`}
									render={({ field: { onChange, value, name } }) => (
										<FormSelect
											onChange={onChange}
											value={value}
											name={name}
											label={'test'}
											placeholder={'test'}
											isPlaceHolder={value == 0 || isEmpty(value)}
											hasError={errors.customerId}
											error={errors.customerId}
											isRequired={true}
										>
											<>
												<OptionStyled key={0} value={0}>
													Choisir un client
												</OptionStyled>
												{!isUndefined(customersAvailable) &&
													customersAvailable.map((item) => {
														return (
															<OptionStyled key={item.id} value={item.id}>
																{item.label}
															</OptionStyled>
														)
													})}
											</>
										</FormSelect>
									)}
								/>
							</PageFormFieldWrapper>
							{!isNull(props.id) && (
								<PageFormFieldWrapper>
									<InputLabelWrapper>
										<InputLabel>Statut</InputLabel>
										{errors.statusId && <InputErrorMessage>{errors.statusId.message?.toString()}</InputErrorMessage>}
									</InputLabelWrapper>
									<Controller
										control={control}
										name={`statusId`}
										render={({ field: { onChange, value, name } }) => (
											<FormSelect
												onChange={onChange}
												value={value}
												name={name}
												label={'test'}
												placeholder={'test'}
												isPlaceHolder={value == 0 || isEmpty(value)}
												hasError={errors.statusId}
												error={errors.statusId}
												isRequired={true}
											>
												<>
													{statusSelect.map((item) => {
														return (
															<OptionStyled key={item.id} value={item.id}>
																{item.label}
															</OptionStyled>
														)
													})}
												</>
											</FormSelect>
										)}
									/>
								</PageFormFieldWrapper>
							)}
						</PageFormColumnWrapper>
					</FormHandler>
					<div style={{ paddingTop: '50px' }}>
						<Button
							type="submit"
							width={100}
							height={50}
							backgroundColor={theme.colors.primary}
							color={theme.colors.white}
							hoverBackgroundColor={theme.colors.primary_200}
							percentUnit={true}
							fontSize={theme.text.fontSize.fl}
							value={!isNull(props.id) ? 'Enregistrer' : 'Valider'}
							onClick={() => {
								if (!errors) props.closeModalHandler()
								handleSubmit(onSubmit)
							}}
						/>
					</div>
				</form>
			</ModalsBodyContainer>
		</Modals>
	)
}

export default ModalAdd
