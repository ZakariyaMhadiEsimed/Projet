import Modals from '../Modals'
import { ModalTitle } from '../Modals/ModalPaper/ModalPaper'
import {
	Button,
	FormHandler,
	InputErrorMessage,
	InputLabel,
	InputLabelWrapper,
	InputWrapper,
	ModalsBodyContainer,
	PageFormColumnWrapper,
	PageFormFieldWrapper,
	StyledInput,
} from '../../theme/GlobalCss'
import { Controller, useForm } from 'react-hook-form'
import { isNull, isUndefined } from 'lodash'
import React, { useEffect, useState } from 'react'
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import theme from '../../theme/theme'
import StyledInputPhoneNumber from '../Form/StyledInputPhoneNumber'
import API_TOKEN from '../../config/AxiosConfig'
import Store from '../../helpers/Store'
import * as R from '../../constants/Endpoint'
import styled from 'styled-components'
import FormRadio from '../Form/FormRadio'

export const RadioListContainer = styled.div`
	display: flex;
	align-items: center;
	margin-left: 1rem;
	margin-top: 0.75rem;
	margin-bottom: 2rem;
`

interface ModalAddProps {
	showModal: boolean
	closeModalHandler: () => void
	id?: number
}
const ModalAdd = (props: ModalAddProps) => {
	const registerFormSchema = Yup.object().shape({
		typeId: Yup.string().required('Champ requis !'),
		firstName: Yup.string().required('Champ requis !').max(150, 'Nombre de caractères trop élevé !'),
		lastName: Yup.string().required('Champ requis !').max(150, 'Nombre de caractères trop élevé !'),
		postalAdress: Yup.string().required('Champ requis !').max(150, 'Nombre de caractères trop élevé !'),
		phone: Yup.string().required('Champ requis !').min(10, 'Format invalide !'),
		email: Yup.string().email('Format invalide !').required('Champ requis !').email('Format invalide !'),
	})
	const [nameToDisplay, setNameToDisplay] = useState<string>('')
	const {
		control,
		handleSubmit,
		formState: { errors },
		setValue,
		getValues,
	} = useForm({
		resolver: yupResolver(registerFormSchema),
	})

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

	const fetchUpdateCustomer = async (data: any): Promise<any> => {
		const token = Store.get('user')
		if (!isNull(props.id)) {
			const customer = await API_TOKEN(token.authenticationToken)
				.put(R.PUT_UPDATE_CUSTOMER(props.id), data)
				.then((res) => res.data)
				.catch((e) => {
					return { error: true, message: JSON.stringify(e) }
				})
			if (!customer.error) {
				return customer
			}
		}
	}

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

	const onSubmit = async (data: any): Promise<void> => {
		if (!isNull(props.id)) {
			data.isCompany = data.typeId
			data.id = props.id
			delete data.typeId
			await fetchUpdateCustomer(data)
		} else {
			await fetchCreateCustomer(data)
		}
		props.closeModalHandler()
	}

	useEffect(() => {
		if (props.id && props.showModal) {
			fetchGetCustomer().then((r) => {
				setValue('typeId', r?.isCompany)
				setValue('firstName', r?.firstName)
				setValue('lastName', r?.lastName)
				setValue('postalAdress', r?.postalAdress)
				setValue('phone', r?.phone)
				setValue('email', r?.email)
				setNameToDisplay(r?.firstName + ' ' + r?.lastName)
			})
		} else setNameToDisplay('Nouveau client')
		getValues('phone')
	}, [props.showModal])

	return (
		<Modals showModal={props.showModal} closeModalHandler={props.closeModalHandler}>
			<ModalTitle>{nameToDisplay}</ModalTitle>
			<ModalsBodyContainer>
				<form onSubmit={handleSubmit(onSubmit)}>
					<PageFormFieldWrapper>
						<InputLabelWrapper>
							<InputLabel>Choisissez le type du client : </InputLabel>
							{errors.firstName && <InputErrorMessage>{errors.firstName.message?.toString()}</InputErrorMessage>}
						</InputLabelWrapper>
						<Controller
							control={control}
							name={`typeId`}
							render={({ field: { onChange, value, name } }) => (
								<RadioListContainer>
									{[
										{ label: 'Particulier', id: 0 },
										{ label: 'Professionnel', id: 1 },
									].map((option) => (
										<FormRadio
											name={name}
											checked={value == option.id}
											onChange={onChange}
											key={option.id}
											value={option.id}
											label={option.label}
										/>
									))}
								</RadioListContainer>
							)}
						/>
					</PageFormFieldWrapper>
					<FormHandler formCols={3}>
						<PageFormColumnWrapper>
							<PageFormFieldWrapper>
								<InputLabelWrapper>
									<InputLabel>Nom</InputLabel>
									{errors.lastName && <InputErrorMessage>{errors.lastName.message?.toString()}</InputErrorMessage>}
								</InputLabelWrapper>
								<Controller
									control={control}
									name={`lastName`}
									render={({ field: { onChange, value, name } }) => (
										<StyledInput
											onChange={onChange}
											value={value}
											name={name}
											data-testid="lastName"
											type="text"
											hasError={!isUndefined(errors.lastName)}
											placeholder={'Saisissez le nom'}
										/>
									)}
								/>
							</PageFormFieldWrapper>
							{getValues('typeId') == 0 && (
								<PageFormFieldWrapper>
									<InputLabelWrapper>
										<InputLabel>Prénom</InputLabel>
										{errors.firstName && <InputErrorMessage>{errors.firstName.message?.toString()}</InputErrorMessage>}
									</InputLabelWrapper>
									<Controller
										control={control}
										name={`firstName`}
										render={({ field: { onChange, value, name } }) => (
											<StyledInput
												onChange={onChange}
												value={value}
												name={name}
												data-testid="firstName"
												type="text"
												hasError={!isUndefined(errors.firstName)}
												placeholder={'Saisissez le prénom'}
											/>
										)}
									/>
								</PageFormFieldWrapper>
							)}
						</PageFormColumnWrapper>
						<PageFormColumnWrapper>
							<PageFormFieldWrapper>
								<InputLabelWrapper>
									<InputLabel>Adresse postale</InputLabel>
									{errors.postalAdress && <InputErrorMessage>{errors.postalAdress.message?.toString()}</InputErrorMessage>}
								</InputLabelWrapper>
								<Controller
									control={control}
									name={`postalAdress`}
									render={({ field: { onChange, value, name } }) => (
										<StyledInput
											onChange={onChange}
											value={value}
											name={name}
											data-testid="postalAdress"
											type="text"
											hasError={!isUndefined(errors.postalAdress)}
											placeholder={'Saisissez votre adresse postale'}
										/>
									)}
								/>
							</PageFormFieldWrapper>
							<PageFormFieldWrapper>
								<InputLabelWrapper>
									<InputLabel>Téléphone</InputLabel>
									{errors.phone && <InputErrorMessage>{errors.phone.message?.toString()}</InputErrorMessage>}
								</InputLabelWrapper>
								<Controller
									control={control}
									name={`phone`}
									render={({ field: { name, value } }) => (
										<StyledInputPhoneNumber
											name={name}
											dataTestId="phone"
											setValue={setValue}
											hasError={!isUndefined(errors.phone)}
											placeholder={'Saisissez le numéro de téléphone'}
											value={value}
										/>
									)}
								/>
							</PageFormFieldWrapper>
						</PageFormColumnWrapper>
					</FormHandler>
					<div style={{ paddingTop: '20px' }}>
						<InputWrapper>
							<InputLabelWrapper>
								<InputLabel>Email</InputLabel>
								{errors.email && <InputErrorMessage>{errors.email.message?.toString()}</InputErrorMessage>}
							</InputLabelWrapper>
							<Controller
								control={control}
								name={`email`}
								render={({ field: { onChange, value, name } }) => (
									<StyledInput
										onChange={onChange}
										value={value}
										name={name}
										data-testid="email"
										type="text"
										hasError={!isUndefined(errors.email)}
										placeholder={"Saisissez l'adresse Email"}
									/>
								)}
							/>
						</InputWrapper>
					</div>
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
							value={props.id ? 'Enregistrer' : 'Valider'}
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
